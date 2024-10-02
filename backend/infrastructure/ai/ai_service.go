package ai_service

import (
	"context"
	"encoding/json"
	"fmt"
	"learned-api/domain"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"reflect"
	"strings"

	"github.com/google/generative-ai-go/genai"
	option "google.golang.org/api/option"
	"rsc.io/pdf"
)

type AIService struct {
	model   domain.AIModelInterface
	context context.Context
	client  genai.Client
}

var AllowedFileTypes = map[string]string{
	"pdf": "application/pdf",
}

func NewAIService(context context.Context, apiKey string) *AIService {
	client, err := genai.NewClient(context, option.WithAPIKey(apiKey))
	if err != nil {
		log.Fatal(err)
	}

	model := client.GenerativeModel("gemini-1.5-flash")
	return &AIService{
		model:   model,
		context: context,
		client:  *client,
	}
}

func (s *AIService) CleanText(value interface{}) string {
	text := s.ExtractText(value)

	cleanedText := strings.ReplaceAll(strings.ReplaceAll(text, "**", ""), "*", "")
	cleanedText = strings.ReplaceAll(cleanedText, "\n\n", "\n")

	return cleanedText
}

func (s *AIService) ExtractText(value interface{}) string {
	v := reflect.ValueOf(value)

	switch v.Kind() {
	case reflect.Struct:
		field := v.FieldByName("Text")
		if !field.IsValid() {
			log.Printf("Field 'Text' not found in struct of type %T", value)
			return ""
		}
		return field.String()

	case reflect.String:
		return v.String()

	default:
		log.Printf("Unsupported type %T for field extraction", value)
		return ""
	}
}

func (s *AIService) EnhanceContent(currentState, query string) (string, domain.CodedError) {
	prompt := fmt.Sprintf("given the following content: %s \n\n enhance it based on the following query: %s", currentState, query)

	resp, err := s.model.GenerateContent(s.context, genai.Text(prompt))
	if err != nil {
		log.Printf("Error generating review content: %v", err)
		return "", domain.NewError(err.Error(), domain.ERR_INTERNAL_SERVER)
	}

	if len(resp.Candidates) == 0 {
		return "", domain.NewError("No suggestions found", domain.ERR_INTERNAL_SERVER)
	}
	if len(resp.Candidates[0].Content.Parts) == 0 {
		return "", domain.NewError("No content parts found", domain.ERR_INTERNAL_SERVER)
	}

	suggestions := s.CleanText(resp.Candidates[0].Content.Parts[0])
	if suggestions == "" {
		return "", domain.NewError("Content extraction failed", domain.ERR_INTERNAL_SERVER)
	}
	return suggestions, nil
}

func (s *AIService) GenerateContentFromFile(post domain.Post) (domain.GenerateContent, domain.CodedError) {
	if err := s.ValidateFile(post.File); err != nil {
		return domain.GenerateContent{}, err
	}
	file, err := s.client.UploadFileFromPath(s.context, post.File, nil)
	if err != nil {
		return domain.GenerateContent{}, domain.NewError(fmt.Sprintf("GenerateContentFromFile: failed to upload file to gemini: %s", err), domain.ERR_INTERNAL_SERVER)
	}
	defer s.client.DeleteFile(s.context, file.Name)
	var pagecount int
	pagecount, errCount := s.CalculatePage(post.File)
	if errCount != nil {
		return domain.GenerateContent{}, errCount
	}

	generatedQuestions, err := s.model.GenerateContent(s.context, genai.Text(fmt.Sprintf(`
Based on the following content, generate %d multiple-choice with an average of 2-5 questions per page, each with exactly 4 choices. Provide an explanation for each correct answer. Return the result in JSON format.

The correct answer should be indicated by the numeric index (starting from 0) of the correct choice, not as a string. The format of the response must strictly follow the example below.

**Response Format**:
[
  {
    "question": "Question 1 text",
    "choices": ["Choice A", "Choice B", "Choice C", "Choice D"],
    "correct_answer": 0, // Numeric index of the correct answer
    "explanation": "Explanation of why the correct choice is correct."
  }
]

Make sure:
1. The correct answer is represented by a number (0, 1, 2, or 3).
2. The response is a valid JSON array with no additional characters outside of the array.
    `, pagecount*3)), genai.FileData{URI: file.URI, MIMEType: "application/pdf"})
	if err != nil {
		return domain.GenerateContent{}, domain.NewError(fmt.Sprintf("GenerateContentFromFile: failed to generate questions through gemini: %s", err), domain.ERR_INTERNAL_SERVER)
	}
	if len(generatedQuestions.Candidates) == 0 {
		return domain.GenerateContent{}, domain.NewError("No candidate found", domain.ERR_INTERNAL_SERVER)
	}
	if len(generatedQuestions.Candidates[0].Content.Parts) == 0 {
		return domain.GenerateContent{}, domain.NewError("No candidate part found", domain.ERR_INTERNAL_SERVER)
	}
	cleanQuestions := s.CleanText(generatedQuestions.Candidates[0].Content.Parts[0])
	if cleanQuestions == "" {
		return domain.GenerateContent{}, domain.NewError("Content extraction failed", domain.ERR_INTERNAL_SERVER)
	}

	var questionsGen []domain.Question
	err = json.Unmarshal([]byte(s.cleanJSONQuestion(cleanQuestions)), &questionsGen)
	if err != nil {
		return domain.GenerateContent{}, domain.NewError(fmt.Sprintf("GenerateContentFromFile: Failed to unmarshal questions response: %s", err), domain.ERR_INTERNAL_SERVER)
	}

	generatedSummary, err := s.model.GenerateContent(s.context, genai.Text(`
	Based on the given content below , generate a summary for the material and return JSON format.
	Format:[ 
	{
	"summary": "summary of the given document as detailed as possible"
	}] `), genai.FileData{URI: file.URI})
	if err != nil {
		return domain.GenerateContent{}, domain.NewError(fmt.Sprintf("GenerateContentFromFile: failed to generate summary through gemini: %s", err), domain.ERR_INTERNAL_SERVER)
	}
	if len(generatedSummary.Candidates) == 0 {
		return domain.GenerateContent{}, domain.NewError("No candidate found", domain.ERR_INTERNAL_SERVER)
	}
	if len(generatedSummary.Candidates[0].Content.Parts) == 0 {
		return domain.GenerateContent{}, domain.NewError("No candidate part found", domain.ERR_INTERNAL_SERVER)
	}
	cleanSummarys := s.CleanText(generatedSummary.Candidates[0].Content.Parts[0])
	if cleanSummarys == "" {
		return domain.GenerateContent{}, domain.NewError("Content extraction failed", domain.ERR_INTERNAL_SERVER)
	}

	var summaryGen []domain.Summary
	err = json.Unmarshal([]byte(s.cleanJSONSummary(cleanSummarys)), &summaryGen)
	if err != nil {
		return domain.GenerateContent{}, domain.NewError(fmt.Sprintf("GenerateContentFromFile: Failed to unmarshal questions response from file: %s", err), domain.ERR_INTERNAL_SERVER)
	}

	return domain.GenerateContent{Questions: questionsGen, Summarys: summaryGen}, nil
}

func (s *AIService) GenerateContentFromText(post domain.Post) (domain.GenerateContent, domain.CodedError) {
	cleanedText := s.CleanText(post.Content)
	if cleanedText == "" {
		return domain.GenerateContent{}, domain.NewError("the post contains an empty content", domain.ERR_BAD_REQUEST)
	}
	wordCount := len(strings.Fields(post.Content))
	if wordCount < 150 {
		return domain.GenerateContent{}, domain.NewError("Insufficent context to process", domain.ERR_BAD_REQUEST)
	}

	generatedQuestions, err := s.model.GenerateContent(s.context, genai.Text(fmt.Sprintf(`
Based on the following content, generate %d multiple-choice questions, each with exactly 4 choices. Provide an explanation for each correct answer. Return the result in JSON format.

The correct answer should be indicated by the numeric index (starting from 0) of the correct choice, not as a string. The format of the response must strictly follow the example below.

Content:
%s

**Response Format**:
[
  {
    "question": "Question 1 text",
    "choices": ["Choice A", "Choice B", "Choice C", "Choice D"],
    "correct_answer": 0, // Numeric index of the correct answer
    "explanation": "Explanation of why the correct choice is correct."
  }
]

Make sure:
1. The correct answer is represented by a number (0, 1, 2, or 3).
2. The response is a valid JSON array with no additional characters outside of the array.
    `, wordCount/150, cleanedText)))
	if err != nil {
		return domain.GenerateContent{}, domain.NewError(fmt.Sprintf("failed to generate questions from text through gemini: %s", err), domain.ERR_INTERNAL_SERVER)
	}
	if len(generatedQuestions.Candidates) == 0 || len(generatedQuestions.Candidates[0].Content.Parts) == 0 {
		return domain.GenerateContent{}, domain.NewError("No candidate or candidate part found", domain.ERR_INTERNAL_SERVER)
	}

	cleanQuestions := s.CleanText(generatedQuestions.Candidates[0].Content.Parts[0])

	var questionsGen []domain.Question
	err = json.Unmarshal([]byte(s.cleanJSONQuestion(cleanQuestions)), &questionsGen)
	if err != nil {
		return domain.GenerateContent{}, domain.NewError(fmt.Sprintf("Failed to unmarshal questions response: %s", err), domain.ERR_INTERNAL_SERVER)
	}

	generatedSummary, err := s.model.GenerateContent(s.context, genai.Text(fmt.Sprintf(`
		Based on the given content below, generate a summary in JSON string format.
		Content: %s
		Response Format: [
		{
			"summary": "Summary of the given content as detailed as possible"
		}]`, cleanedText)))
	if err != nil {
		return domain.GenerateContent{}, domain.NewError(fmt.Sprintf("Failed to generate summary through gemini: %s", err), domain.ERR_INTERNAL_SERVER)
	}
	if len(generatedSummary.Candidates) == 0 || len(generatedSummary.Candidates[0].Content.Parts) == 0 {
		return domain.GenerateContent{}, domain.NewError("No candidate or candidate part found", domain.ERR_INTERNAL_SERVER)
	}

	// Clean and log raw summary response
	cleanSummary := s.CleanText(generatedSummary.Candidates[0].Content.Parts[0])

	var summaryGen []domain.Summary
	err = json.Unmarshal([]byte(s.cleanJSONSummary(cleanSummary)), &summaryGen)
	if err != nil {
		return domain.GenerateContent{}, domain.NewError(fmt.Sprintf("Failed to unmarshal summary response: %s", err), domain.ERR_INTERNAL_SERVER)
	}

	return domain.GenerateContent{Questions: questionsGen, Summarys: summaryGen}, nil
}

func (s *AIService) ValidateFile(filePath string) domain.CodedError {
	extension := strings.ToLower(filepath.Ext(filePath))
	extension = extension[1:]
	if extension == "" {
		return domain.NewError(fmt.Sprintf("file %s has no extension", extension), domain.ERR_FORBIDDEN)
	}
	expectedMimeType, allowed := AllowedFileTypes[extension]
	if !allowed {
		return domain.NewError(fmt.Sprintf("file %s is not an allowed type of extension", extension), domain.ERR_FORBIDDEN)
	}

	file, err := os.Open(filePath)
	if err != nil {
		return domain.NewError(fmt.Sprintf("failed to open file: %s", err), domain.ERR_INTERNAL_SERVER)
	}
	defer file.Close()
	buffer := make([]byte, 512)
	_, err = file.Read(buffer)
	if err != nil {
		return domain.NewError(fmt.Sprintf("failed to read the file: %s", err), domain.ERR_INTERNAL_SERVER)
	}

	mimeType := http.DetectContentType(buffer)
	if mimeType != expectedMimeType {
		return domain.NewError(fmt.Sprintf("file type mismatch: expected %s but got %s", expectedMimeType, mimeType), domain.ERR_FORBIDDEN)
	}
	return nil
}

func (s *AIService) cleanJSONQuestion(response string) string {
	leftPtr, rightPtr := 0, len(response)-1
	for response[leftPtr] != '[' {
		leftPtr++
	}
	for response[rightPtr] != ']' {
		rightPtr--
	}
	return response[leftPtr : rightPtr+1]
}

func (s *AIService) cleanJSONSummary(response string) string {
	leftPtr, rightPtr := 0, len(response)-1
	for leftPtr < len(response) && response[leftPtr] != '[' {
		leftPtr++
	}
	for rightPtr >= 0 && response[rightPtr] != ']' {
		rightPtr--
	}
	return response[leftPtr : rightPtr+1]
}

func (s *AIService) CalculatePage(filepath string) (int, domain.CodedError) {
	file, err := os.Open(filepath)
	if err != nil {
		return 0, domain.NewError(err.Error(), domain.ERR_INTERNAL_SERVER)
	}
	defer file.Close()

	fileInfo, err := file.Stat()
	if err != nil {
		return 0, domain.NewError(err.Error(), domain.ERR_INTERNAL_SERVER)
	}
	reader, err := pdf.NewReader(file, fileInfo.Size())
	if err != nil {
		return 0, domain.NewError(err.Error(), domain.ERR_INTERNAL_SERVER)
	}
	return reader.NumPage(), nil
}

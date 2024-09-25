package ai_service

import (
	"context"
	"encoding/json"
	"fmt"
	"learned-api/domain"
	"learned-api/domain/dtos"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"reflect"
	"strings"

	"github.com/google/generative-ai-go/genai"
	option "google.golang.org/api/option"
)

type AIService struct {
	model   domain.AIModelInterface
	context context.Context
	client  genai.Client
}

var AllowedFileTypes = map[string]string{
	"pdf": "application/pdf",
}

var numberOfQuestions = 100

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

// send file to generate question and summary for a given file in post
func (s *AIService) GenerateContentFromFile(post domain.Post) (dtos.GenerateContentDTO, domain.CodedError) {
	if err := s.ValidateFile(post.File); err != nil {
		return dtos.GenerateContentDTO{}, err
	}
	file, err := s.client.UploadFileFromPath(s.context, post.File, nil)
	if err != nil {
		return dtos.GenerateContentDTO{}, domain.NewError(fmt.Sprintf("failed to upload file to gemini: %s", err), domain.ERR_INTERNAL_SERVER)
	}
	defer s.client.DeleteFile(s.context, file.Name)

	generatedQuestions, err := s.model.GenerateContent(s.context, genai.Text(fmt.Sprintf(`
        Based on the following content, generate %d multiple-choice questions with 4 choices each. 
        Also, provide an explanation for the correct answer. Return the result in JSON format.
		Format: 
		  [
        {
            "question": "Question 1 text",
            "choices": [
                "Choice A",
                "Choice B",
                "Choice C",
                "Choice D"
            ],
            "correct_answer": "Index of the correct answer",
            "explanation": "Explanation of why choice A is correct."
        },
        {
            "question": "Question 2 text",
            "choices": [
                "Choice A",
                "Choice B",
                "Choice C",
                "Choice D"
            ],
            "correct_answer": "Index of the correct answer",
            "explanation": "Explanation of why choice B is correct."
        }
    ]
    `, 100)), genai.FileData{URI: file.URI})
	if err != nil {
		return dtos.GenerateContentDTO{}, domain.NewError(fmt.Sprintf("failed to generate questions through gemini: %s", err), domain.ERR_INTERNAL_SERVER)
	}
	if len(generatedQuestions.Candidates) == 0 {
		return dtos.GenerateContentDTO{}, domain.NewError("No candidate found", domain.ERR_INTERNAL_SERVER)
	}
	if len(generatedQuestions.Candidates[0].Content.Parts) == 0 {
		return dtos.GenerateContentDTO{}, domain.NewError("No candidate part found", domain.ERR_INTERNAL_SERVER)
	}
	cleanQuestions := s.CleanText(generatedQuestions.Candidates[0].Content.Parts[0])
	if cleanQuestions == "" {
		return dtos.GenerateContentDTO{}, domain.NewError("Content extraction failed", domain.ERR_INTERNAL_SERVER)
	}
	var questionsGen []dtos.QuestionDTO
	err = json.Unmarshal([]byte(cleanQuestions), &questionsGen)
	if err != nil {
		return dtos.GenerateContentDTO{}, domain.NewError(fmt.Sprintf("Failed to unmarshal questions response: %s", err), domain.ERR_INTERNAL_SERVER)
	}

	generatedSummary, err := s.model.GenerateContent(s.context, genai.Text(`
	Based on the given content below , generate a summary for the material and return JSON format.
	Format: 
	{
	"summary": "summary of the given document as detailed as possible"
	} `), genai.FileData{URI: file.URI})
	if err != nil {
		return dtos.GenerateContentDTO{}, domain.NewError(fmt.Sprintf("failed to generate summary through gemini: %s", err), domain.ERR_INTERNAL_SERVER)
	}
	if len(generatedSummary.Candidates) == 0 {
		return dtos.GenerateContentDTO{}, domain.NewError("No candidate found", domain.ERR_INTERNAL_SERVER)
	}
	if len(generatedSummary.Candidates[0].Content.Parts) == 0 {
		return dtos.GenerateContentDTO{}, domain.NewError("No candidate part found", domain.ERR_INTERNAL_SERVER)
	}
	cleanSummarys := s.CleanText(generatedSummary.Candidates[0].Content.Parts[0])
	if cleanSummarys == "" {
		return dtos.GenerateContentDTO{}, domain.NewError("Content extraction failed", domain.ERR_INTERNAL_SERVER)
	}

	var summaryGen []dtos.SummaryDTO
	err = json.Unmarshal([]byte(cleanSummarys), &summaryGen)
	if err != nil {
		return dtos.GenerateContentDTO{}, domain.NewError(fmt.Sprintf("Failed to unmarshal questions response: %s", err), domain.ERR_INTERNAL_SERVER)
	}

	return dtos.GenerateContentDTO{Questions: questionsGen, Summarys: summaryGen}, nil
}

// generate questions from an input text
func (s *AIService) GenerateContentFromText(post domain.Post) (dtos.GenerateContentDTO, domain.CodedError) {
	cleanedText := s.CleanText(post.Content)
	if cleanedText == "" {
		return dtos.GenerateContentDTO{}, domain.NewError("the post contains an empty content", domain.ERR_BAD_REQUEST)
	}
	generatedQuestions, err := s.model.GenerateContent(s.context, genai.Text(fmt.Sprintf(`
        Based on the following content, generate %d multiple-choice questions with 4 choices each. 
        Also, provide an explanation for the correct answer. Return the result in JSON format.
		Content: %s
		Format: 
		  [
        {
            "question": "Question 1 text",
            "choices": [
                "Choice A",
                "Choice B",
                "Choice C",
                "Choice D"
            ],
            "correct_answer": "Index of the correct answer",
            "explanation": "Explanation of why choice A is correct."
        },
        {
            "question": "Question 2 text",
            "choices": [
                "Choice A",
                "Choice B",
                "Choice C",
                "Choice D"
            ],
            "correct_answer": "Index of the correct answer",
            "explanation": "Explanation of why choice B is correct."
        }
    ]
    `, numberOfQuestions, cleanedText)))
	if err != nil {
		return dtos.GenerateContentDTO{}, domain.NewError(fmt.Sprintf("failed to generate questions from text through gemini: %s", err), domain.ERR_INTERNAL_SERVER)
	}
	if len(generatedQuestions.Candidates) == 0 {
		return dtos.GenerateContentDTO{}, domain.NewError("No candidate found", domain.ERR_INTERNAL_SERVER)
	}
	if len(generatedQuestions.Candidates[0].Content.Parts) == 0 {
		return dtos.GenerateContentDTO{}, domain.NewError("No candidate part found", domain.ERR_INTERNAL_SERVER)
	}
	cleanQuestions := s.CleanText(generatedQuestions.Candidates[0].Content.Parts[0])
	if cleanQuestions == "" {
		return dtos.GenerateContentDTO{}, domain.NewError("Content extraction failed", domain.ERR_INTERNAL_SERVER)
	}
	var questionsGen []dtos.QuestionDTO
	err = json.Unmarshal([]byte(cleanQuestions), &questionsGen)
	if err != nil {
		return dtos.GenerateContentDTO{}, domain.NewError(fmt.Sprintf("Failed to unmarshal questions response: %s", err), domain.ERR_INTERNAL_SERVER)
	}

	generatedSummary, err := s.model.GenerateContent(s.context, genai.Text(fmt.Sprintf(`
	Based on the given content below , generate a summary and return JSON format.
	Content: %s
	Format: 
	{
	"summary": "summary of the given content as detailed as possible"
	} `, cleanedText)))
	if err != nil {
		return dtos.GenerateContentDTO{}, domain.NewError(fmt.Sprintf("failed to generate summary through gemini: %s", err), domain.ERR_INTERNAL_SERVER)
	}
	if len(generatedSummary.Candidates) == 0 {
		return dtos.GenerateContentDTO{}, domain.NewError("No candidate found", domain.ERR_INTERNAL_SERVER)
	}
	if len(generatedSummary.Candidates[0].Content.Parts) == 0 {
		return dtos.GenerateContentDTO{}, domain.NewError("No candidate part found", domain.ERR_INTERNAL_SERVER)
	}
	cleanSummarys := s.CleanText(generatedSummary.Candidates[0].Content.Parts[0])
	if cleanSummarys == "" {
		return dtos.GenerateContentDTO{}, domain.NewError("Content extraction failed", domain.ERR_INTERNAL_SERVER)
	}

	var summaryGen []dtos.SummaryDTO
	err = json.Unmarshal([]byte(cleanSummarys), &summaryGen)
	if err != nil {
		return dtos.GenerateContentDTO{}, domain.NewError(fmt.Sprintf("Failed to unmarshal questions response: %s", err), domain.ERR_INTERNAL_SERVER)
	}

	return dtos.GenerateContentDTO{Questions: questionsGen, Summarys: summaryGen}, nil
}

func (s *AIService) EnhanceQuestions(currentQuestions string) (string, domain.CodedError) {
	prompt := "Review the following question content and provide suggestions or enhancements:\n\n" + currentQuestions +
		"\n\nProvide constructive feedback, highlight improvements, and suggest any enhancements."
	enhancedQuestion, err := s.model.GenerateContent(s.context, genai.Text(prompt))
	if err != nil {
		return "", domain.NewError(fmt.Sprintf("failed to generate enhancement for the questions: %s", err), domain.ERR_INTERNAL_SERVER)
	}
	if len(enhancedQuestion.Candidates) == 0 {
		return "", domain.NewError("No suggestion found.", domain.ERR_INTERNAL_SERVER)
	}
	if len(enhancedQuestion.Candidates[0].Content.Parts) == 0 {
		return "", domain.NewError("No content part found.", domain.ERR_INTERNAL_SERVER)
	}
	suggestion := s.CleanText(enhancedQuestion.Candidates[0].Content.Parts[0])
	if suggestion == "" {
		return "", domain.NewError("Suggesiton extraction failed", domain.ERR_INTERNAL_SERVER)
	}
	return suggestion, nil
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

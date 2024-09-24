package ai_service

import (
	"context"
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

	model := client.GenerativeModel("gemini-pro")
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

// send file to generate question
func (s *AIService) GenerateQuestionsFromFile(post domain.Post) domain.CodedError {
	if err := s.ValidateFile(post.File); err != nil {
		return err
	}
	file, err := s.client.UploadFileFromPath(s.context, post.File, nil)
	if err != nil {
		return domain.NewError(fmt.Sprintf("failed to upload file to gemini: %s", err), domain.ERR_INTERNAL_SERVER)
	}
	defer s.client.DeleteFile(s.context, file.Name)

	_, err = s.model.GenerateContent(s.context, genai.Text(fmt.Sprintf(`
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
    `, 100)),genai.FileData{URI: file.URI})
	if err != nil{
		return domain.NewError(fmt.Sprintf("failed to generate questions through gemini: %s", err), domain.ERR_INTERNAL_SERVER)
	}
	return nil
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

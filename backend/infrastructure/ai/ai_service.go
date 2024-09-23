package ai_service

import (
	"context"
	"learned-api/domain"
	"log"
	"reflect"
	"strings"

	"github.com/google/generative-ai-go/genai"
	option "google.golang.org/api/option"
)

type AIService struct {
	model   domain.AIModelInterface
	context context.Context
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

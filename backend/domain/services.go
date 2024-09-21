package domain

import (
	"context"
	"time"

	"github.com/golang-jwt/jwt"
	"github.com/google/generative-ai-go/genai"
)

type HashingServiceInterface interface {
	HashString(password string) (string, CodedError)
	ValidateHashedString(hashedString string, plaintextString string) CodedError
}

type JWTServiceInterface interface {
	SignJWTWithPayload(username string, role string, tokenType string, tokenLifeSpan time.Duration) (string, CodedError)
	ValidateAndParseToken(rawToken string) (*jwt.Token, error)
	GetExpiryDate(token *jwt.Token) (time.Time, CodedError)
	GetEmail(token *jwt.Token) (string, CodedError)
	GetRole(token *jwt.Token) (string, CodedError)
	GetTokenType(token *jwt.Token) (string, CodedError)
}

type AIModelInterface interface {
	GenerateContent(context.Context, ...genai.Part) (*genai.GenerateContentResponse, error)
}

type AuthValidation interface {
	ValidateName(name string) CodedError
	ValidatieEmail(email string) CodedError
	ValidatePassword(password string) CodedError
	ValidateType(userType string) CodedError
	ValidateUser(user User) CodedError
}

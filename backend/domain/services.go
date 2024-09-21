package domain

import (
	"time"

	"github.com/golang-jwt/jwt"
)

type HashingServiceInterface interface {
	HashString(password string) (string, CodedError)
	ValidateHashedString(hashedString string, plaintextString string) CodedError
}

type JWTServiceInterface interface {
	SignJWTWithPayload(username string, role string, tokenType string, tokenLifeSpan time.Duration) (string, CodedError)
	ValidateAndParseToken(rawToken string) (*jwt.Token, error)
	GetExpiryDate(token *jwt.Token) (time.Time, CodedError)
	GetUsername(token *jwt.Token) (string, CodedError)
	GetRole(token *jwt.Token) (string, CodedError)
	GetTokenType(token *jwt.Token) (string, CodedError)
}

type AuthValidation interface {
	ValidateName(name string) CodedError
	ValidatieEmail(email string) CodedError
	ValidatePassword(password string) CodedError
	ValidateType(userType string) CodedError
	ValidateUser(user User) CodedError
}

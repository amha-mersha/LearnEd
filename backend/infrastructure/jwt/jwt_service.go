package jwt_service

import (
	"fmt"
	"learned-api/domain"
	"time"

	"github.com/golang-jwt/jwt"
)

type JWTService struct {
	secret string
}

func NewJWTService(secret string) *JWTService {
	return &JWTService{secret: secret}
}

func (s *JWTService) SignJWTWithPayload(email string, role string, tokenType string, tokenLifeSpan time.Duration) (string, domain.CodedError) {
	if s.secret == "" {
		return "", domain.NewError("internal server error", domain.ERR_INTERNAL_SERVER)
	}

	if tokenType != "accessToken" && tokenType != "refreshToken" {
		return "", domain.NewError("Invalid token type field", domain.ERR_INTERNAL_SERVER)
	}

	jwtSecret := []byte(s.secret)
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"email":     email,
		"role":      role,
		"expiresAt": time.Now().Round(0).Add(tokenLifeSpan),
		"tokenType": tokenType,
	})
	jwtToken, signingErr := token.SignedString(jwtSecret)
	if signingErr != nil {
		return "", domain.NewError("internal server error: "+signingErr.Error(), domain.ERR_INTERNAL_SERVER)
	}

	return jwtToken, nil
}

func (s *JWTService) ValidateAndParseToken(rawToken string) (*jwt.Token, error) {
	token, err := jwt.Parse(rawToken, func(t *jwt.Token) (interface{}, error) {
		_, ok := t.Method.(*jwt.SigningMethodHMAC)
		if !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", t.Header["alg"])
		}

		return []byte(s.secret), nil
	})

	if err != nil {
		return nil, fmt.Errorf("error: " + err.Error())
	}

	if !token.Valid {
		return nil, fmt.Errorf("error: Invalid token,  Potentially malformed")
	}

	return token, nil
}

func (s *JWTService) GetExpiryDate(token *jwt.Token) (time.Time, domain.CodedError) {
	expiresAt, ok := token.Claims.(jwt.MapClaims)["expiresAt"]
	if !ok {
		return time.Now(), domain.NewError("Invalid token: Expiry date not found", domain.ERR_UNAUTHORIZED)
	}

	expiresAtTime, convErr := time.Parse(time.RFC3339Nano, fmt.Sprintf("%v", expiresAt))
	if convErr != nil {
		return time.Now(), domain.NewError("Error while parsing expiry date: "+convErr.Error(), domain.ERR_UNAUTHORIZED)
	}

	return expiresAtTime, nil
}

func (s *JWTService) GetEmail(token *jwt.Token) (string, domain.CodedError) {
	email, ok := token.Claims.(jwt.MapClaims)["email"]
	if !ok {
		return "", domain.NewError("Invalid token: Email not found", domain.ERR_UNAUTHORIZED)
	}

	return fmt.Sprintf("%v", email), nil
}

func (s *JWTService) GetRole(token *jwt.Token) (string, domain.CodedError) {
	role, ok := token.Claims.(jwt.MapClaims)["role"]
	if !ok {
		return "", domain.NewError("Invalid token: Role not found", domain.ERR_UNAUTHORIZED)
	}

	return fmt.Sprintf("%v", role), nil
}

func (s *JWTService) GetTokenType(token *jwt.Token) (string, domain.CodedError) {
	tokenType, ok := token.Claims.(jwt.MapClaims)["tokenType"]
	if !ok {
		return "", domain.NewError("Invalid token: TokenType not found", domain.ERR_UNAUTHORIZED)
	}

	return fmt.Sprintf("%v", tokenType), nil
}

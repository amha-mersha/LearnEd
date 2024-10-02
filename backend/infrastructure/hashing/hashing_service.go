package hashing_service

import (
	"learned-api/domain"

	"golang.org/x/crypto/bcrypt"
)

type HashingService struct{}

func NewHashingService() *HashingService {
	return &HashingService{}
}

func (s *HashingService) HashString(password string) (string, domain.CodedError) {
	hashedPwd, hashErr := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if hashErr != nil {
		return "", domain.NewError("Internal server error: "+hashErr.Error(), domain.ERR_INTERNAL_SERVER)
	}

	return string(hashedPwd), nil
}

func (s *HashingService) ValidateHashedString(hashedString string, plaintextString string) domain.CodedError {
	compErr := bcrypt.CompareHashAndPassword([]byte(hashedString), []byte(plaintextString))
	if compErr != nil {
		return domain.NewError("Invalid signature", domain.ERR_UNAUTHORIZED)
	}

	return nil
}
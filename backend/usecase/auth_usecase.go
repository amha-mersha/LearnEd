package usecases

import (
	"learned-api/domain"
	"learned-api/domain/dtos"
)

type AuthUsecase struct {
	repository domain.AuthRepository
}

func NewAuthUsecase(repository domain.AuthRepository) *AuthUsecase {
	return &AuthUsecase{
		repository: repository,
	}
}

func (usecase *AuthUsecase) Signup(user dtos.SignupDTO) domain.CodedError {
	return nil
}

func (usecase *AuthUsecase) Login(user dtos.LoginDTO) (string, domain.CodedError) {
	return "", nil
}

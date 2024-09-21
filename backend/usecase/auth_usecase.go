package usecases

import (
	"learned-api/domain"
	"learned-api/domain/dtos"
	"strings"
)

type AuthUsecase struct {
	repository domain.AuthRepository
	validation domain.AuthValidation
}

func NewAuthUsecase(repository domain.AuthRepository, validationRules domain.AuthValidation) *AuthUsecase {
	return &AuthUsecase{
		repository: repository,
		validation: validationRules,
	}
}

func (usecase *AuthUsecase) Signup(user dtos.SignupDTO) domain.CodedError {
	newUser := domain.User{
		Name:     user.Name,
		Email:    user.Email,
		Password: user.Password,
		Type:     user.Type,
	}

	newUser.Email = strings.ReplaceAll(strings.TrimSpace(strings.ToLower(user.Email)), " ", "")
	newUser.Name = strings.TrimSpace(user.Name)
	newUser.Type = strings.TrimSpace(user.Type)
	if err := usecase.validation.ValidateUser(newUser); err != nil {
		return err
	}

	if err := usecase.repository.CreateUser(newUser); err != nil {
		return err
	}

	return nil
}

func (usecase *AuthUsecase) Login(user dtos.LoginDTO) (string, domain.CodedError) {
	return "", nil
}

package usecases

import "learned-api/domain"

type AuthUsecase struct {
	repository domain.AuthRepository
}

func NewAuthUsecase(repository domain.AuthRepository) *AuthUsecase {
	return &AuthUsecase{
		repository: repository,
	}
}

func (usecase *AuthUsecase) Signup(user domain.User) domain.CodedError {
	return nil
}

func (usecase *AuthUsecase) Login(user domain.User) (string, domain.CodedError) {
	return "", nil
}

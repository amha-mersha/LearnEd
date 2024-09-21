package usecases

import (
	"learned-api/domain"
	"learned-api/domain/dtos"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
)

type AuthUsecase struct {
	repository     domain.AuthRepository
	validation     domain.AuthValidation
	hashingService domain.HashingServiceInterface
	jwtService     domain.JWTServiceInterface
}

func NewAuthUsecase(repository domain.AuthRepository, validationRules domain.AuthValidation, hashingService domain.HashingServiceInterface, jwtService domain.JWTServiceInterface) *AuthUsecase {
	return &AuthUsecase{
		repository:     repository,
		validation:     validationRules,
		hashingService: hashingService,
		jwtService:     jwtService,
	}
}

func (usecase *AuthUsecase) Signup(c *gin.Context, user dtos.SignupDTO) domain.CodedError {
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

	hashedPwd, hashErr := usecase.hashingService.HashString(newUser.Password)
	if hashErr != nil {
		return hashErr
	}

	newUser.Password = hashedPwd
	if err := usecase.repository.CreateUser(c, newUser); err != nil {
		return err
	}

	return nil
}

func (usecase *AuthUsecase) Login(c *gin.Context, user dtos.LoginDTO) (string, domain.CodedError) {
	user.Email = strings.ReplaceAll(strings.TrimSpace(strings.ToLower(user.Email)), " ", "")
	foundUser, err := usecase.repository.GetUserByEmail(c, user.Email)
	if err != nil {
		return "", err
	}

	if err := usecase.hashingService.ValidateHashedString(foundUser.Password, user.Password); err != nil {
		return "", err
	}

	// TODO: replace token duration with an env constant
	token, err := usecase.jwtService.SignJWTWithPayload(foundUser.Email, foundUser.Type, "accessToken", 15*time.Minute)
	if err != nil {
		return "", err
	}

	return token, nil
}

package domain

import (
	"learned-api/domain/dtos"

	"github.com/gin-gonic/gin"
)

const (
	CollectionUsers = "users"
)

const (
	RoleTeacher = "teacher"
	RoleStudent = "student"
)

type Response gin.H

type EnvironmentVariables struct {
	DB_ADDRESS  string
	DB_NAME     string
	PORT        int
	ROUTEPREFIX string
}

type User struct {
	Name     string `json:"name"`
	Email    string `json:"email"`
	Password string `json:"password"`
	Type     string `json:"type"`
}

type AuthUsecase interface {
	Signup(c *gin.Context, user dtos.SignupDTO) CodedError
	Login(c *gin.Context, user dtos.LoginDTO) (string, CodedError)
	ChangePassword(c *gin.Context, user dtos.ChangePasswordDTO) CodedError
}

type AuthRepository interface {
	CreateUser(c *gin.Context, user User) CodedError
	GetUserByEmail(c *gin.Context, email string) (User, CodedError)
}

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

type StudentRecord struct {
	PostID string `json:"post_id"`
	Grade  int    `json:"grade"`
}

type StudentGrade struct {
	StudentID string          `json:"student_id"`
	Records   []StudentRecord `json:"records"`
}

type Post struct {
	GroupID     string   `json:"group_id"`
	Content     string   `json:"content"`
	Files       []string `json:"files"`
	IsProcessed bool     `json:"is_processed"`
	// TODO: Add fields for the processed data
}

type Classroom struct {
	Name          string         `json:"name"`
	Teachers      []interface{}  `json:"teachers"`
	Students      []interface{}  `json:"students"`
	StudentGrades []StudentGrade `json:"student_grades"`
	Posts         []Post         `json:"posts"`
}

type StudyGroup struct {
	Name     string        `json:"name"`
	Students []interface{} `json:"students"`
	Posts    []Post        `json:"posts"`
}

type AuthUsecase interface {
	Signup(c *gin.Context, user dtos.SignupDTO) CodedError
	Login(c *gin.Context, user dtos.LoginDTO) (string, CodedError)
	ChangePassword(c *gin.Context, user dtos.ChangePasswordDTO) CodedError
}

type AuthRepository interface {
	CreateUser(c *gin.Context, user User) CodedError
	GetUserByEmail(c *gin.Context, email string) (User, CodedError)
	UpdateUser(c *gin.Context, user User) CodedError
}

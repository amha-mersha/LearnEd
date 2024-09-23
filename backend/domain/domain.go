package domain

import (
	"context"
	"learned-api/domain/dtos"
	"time"

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
	JWT_SECRET  string
}

type User struct {
	ID       string `json:"id" bson:"_id"`
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
	ID           string    `json:"id" bson:"_id"`
	GroupID      string    `json:"group_id"`
	Content      string    `json:"content"`
	File         string    `json:"file"`
	IsProcessed  bool      `json:"is_processed"`
	IsAssignment bool      `json:"is_assignment"`
	Deadline     time.Time `json:"deadline"`
	// TODO: Add fields for the processed data
}

type Classroom struct {
	Name          string         `json:"name"`
	Owner         string         `json:"owner"`
	Teachers      []string       `json:"teachers"`
	Students      []string       `json:"students"`
	StudentGrades []StudentGrade `json:"student_grades"`
	Posts         []Post         `json:"posts"`
}

type StudyGroup struct {
	Name     string   `json:"name"`
	Students []string `json:"students"`
	Posts    []Post   `json:"posts"`
}

type AuthUsecase interface {
	Signup(c *gin.Context, user dtos.SignupDTO) CodedError
	Login(c *gin.Context, user dtos.LoginDTO) (string, CodedError)
	ChangePassword(c *gin.Context, user dtos.ChangePasswordDTO) CodedError
}

type AuthRepository interface {
	CreateUser(c *gin.Context, user User) CodedError
	GetUserByEmail(c *gin.Context, email string) (User, CodedError)
	UpdateUser(c *gin.Context, userEmail string, user User) CodedError
}

type ClassroomUsecase interface {
	CreateClassroom(c context.Context, creatorID string, classroom Classroom) CodedError
	DeleteClassroom(c context.Context, teacherID string, classroomID string) CodedError
	AddPost(c context.Context, creatorID string, classroomID string, post Post) CodedError
	RemovePost(c context.Context, creatorID string, classroomID string, postID string) CodedError
}

type ClassroomRepository interface {
	CreateClassroom(c context.Context, classroom Classroom) CodedError
	DeleteClassroom(c context.Context, classroomID string) CodedError
	FindClassroom(c context.Context, classroomID string) (Classroom, CodedError)
	AddPost(c context.Context, classroomID string, post Post) CodedError
	RemovePost(c context.Context, classroomID string, postID string) CodedError
}

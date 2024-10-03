package domain

import (
	"context"
	"learned-api/domain/dtos"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

const (
	CollectionUsers      = "users"
	CollectionClassrooms = "classrooms"
	CollectionStudyGroup = "study_group"
	CollectionResources  = "resources"
)

const (
	RoleTeacher = "teacher"
	RoleStudent = "student"
)

type Response gin.H

type ObjectID primitive.ObjectID

type EnvironmentVariables struct {
	DB_ADDRESS  string
	DB_NAME     string
	PORT        int
	ROUTEPREFIX string
	JWT_SECRET  string
	GEMINI_KEY  string
}

type User struct {
	ID       primitive.ObjectID `json:"id" bson:"_id"`
	Name     string             `json:"name"`
	Email    string             `json:"email"`
	Password string             `json:"password"`
	Type     string             `json:"type"`
}

type StudentRecord struct {
	RecordName string `json:"record_name" bson:"record_name"`
	Grade      int    `json:"grade"`
	MaxGrade   int    `json:"max_grade" bson:"max_grade"`
}

type StudentGrade struct {
	StudentID primitive.ObjectID `json:"student_id" bson:"student_id"`
	Records   []StudentRecord    `json:"records"`
}

type GetGradesDTO struct {
	Data        StudentGrade `json:"data"`
	StudentName string       `json:"name"`
}

type GradeReport struct {
	Grades        StudentGrade       `json:"grades"`
	ClassroomID   primitive.ObjectID `json:"classroom_id"`
	ClassroomName string             `json:"classroom_name"`
}

type GetGradeReportDTO struct {
	Data []GradeReport `json:"data"`
}

type Summary struct {
	Summary string `json:"summary" bson:"summary"`
}

type Question struct {
	Question      string   `json:"question" bson:"question"`
	Choices       []string `json:"choices" bson:"choices"`
	CorrectAnswer int      `json:"correct_answer" bson:"correct_answer"`
	Explanation   string   `json:"explanation" bson:"explanation"`
}
type Comment struct {
	ID          primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	CreatorID   primitive.ObjectID `json:"creator_id"`
	CreatorName string             `json:"creator_name"`
	Content     string             `json:"content"`
	CreatedAt   time.Time          `json:"created_at"`
}

type Post struct {
	ID           primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	CreatorID    primitive.ObjectID `json:"creator_id" bson:"creator_id"`
	Content      string             `json:"content"`
	File         string             `json:"file"`
	FileName     string             `json:"file_name"`
	IsProcessed  bool               `json:"is_processed" bson:"is_processed"`
	IsAssignment bool               `json:"is_assignment" bson:"is_assignment"`
	Deadline     time.Time          `json:"deadline"`
	Comments     []Comment          `json:"comments"`
	CreatedAt    time.Time          `json:"created_at" bson:"created_at"`
	// TODO: Add fields for the processed data
}

type GetPostDTO struct {
	CreatorName string `json:"creator_name"`
	Data        Post   `json:"data"`
}

type FlashCard struct {
	Question    string `json:"question" bson:"question"`
	Explanation string `json:"explanation" bson:"explanation"`
}

type GenerateContent struct {
	ID        primitive.ObjectID `json:"id" bson:"_id"`
	PostID    primitive.ObjectID `json:"post_id" bson:"post_id"`
	Questions []Question         `json:"questions"`
	Summarys  []Summary          `json:"summarys" bson:"summarys"`
}

type Classroom struct {
	ID            primitive.ObjectID   `json:"id" bson:"_id,omitempty"`
	Name          string               `json:"name"`
	CourseName    string               `json:"course_name"`
	Season        string               `json:"season"`
	Owner         primitive.ObjectID   `json:"owner"`
	Teachers      []primitive.ObjectID `json:"teachers"`
	Students      []primitive.ObjectID `json:"students"`
	StudentGrades []StudentGrade       `json:"student_grades" bson:"student_grades"`
	Posts         []Post               `json:"posts"`
}

type StudyGroup struct {
	ID         primitive.ObjectID   `json:"id" bson:"_id,omitempty"`
	Name       string               `json:"name"`
	CourseName string               `json:"course_name"`
	Owner      primitive.ObjectID   `json:"owner"`
	Students   []primitive.ObjectID `json:"students"`
	Posts      []Post               `json:"posts"`
}

type AuthUsecase interface {
	Signup(c context.Context, user dtos.SignupDTO) CodedError
	Login(c context.Context, user dtos.LoginDTO) (string, string, CodedError)
	ChangePassword(c context.Context, user dtos.ChangePasswordDTO) CodedError
}

type AuthRepository interface {
	CreateUser(c context.Context, user User) CodedError
	GetUserByEmail(c context.Context, email string) (User, CodedError)
	GetUserByID(c context.Context, id string) (User, CodedError)
	UpdateUser(c context.Context, userEmail string, user User) CodedError
	HexifyString(id primitive.ObjectID) string
}

type ClassroomUsecase interface {
	CreateClassroom(c context.Context, creatorID string, classroom Classroom) CodedError
	DeleteClassroom(c context.Context, teacherID string, classroomID string) CodedError
	AddPost(c context.Context, creatorID string, classroomID string, post Post) CodedError
	UpdatePost(c context.Context, creatorID string, classroomID string, postID string, post dtos.UpdatePostDTO) CodedError
	RemovePost(c context.Context, creatorID string, classroomID string, postID string) CodedError
	AddComment(c context.Context, creatorID string, classroomID string, postID string, comment Comment) CodedError
	RemoveComment(c context.Context, creatorID string, classroomID string, postID string, commentID string) CodedError
	PutGrade(c context.Context, teacherID string, classroomID string, studentID string, gradeDto dtos.GradeDTO) CodedError
	AddStudent(c context.Context, tokenID string, studentEmail string, classroomID string) CodedError
	RemoveStudent(c context.Context, tokenID string, classroomID string, studentID string) CodedError
	GetGrades(c context.Context, teacherID string, classroomID string) ([]GetGradesDTO, CodedError)
	GetStudentGrade(c context.Context, tokenID string, studentID string, classroomID string) (StudentGrade, CodedError)
	GetPosts(c context.Context, tokenID string, classroomID string) ([]GetPostDTO, CodedError)
	GetClassrooms(c context.Context, tokenID string) ([]Classroom, CodedError)
	GetGradeReport(c context.Context, tokenID string, studentID string) (GetGradeReportDTO, CodedError)
	EnhanceContent(currentState, query string) (string, CodedError)
	GetQuiz(c context.Context, postID string) ([]Question, CodedError)
	GetSummary(c context.Context, postID string) (Summary, CodedError)
	GetFlashCard(c context.Context, postID string) ([]FlashCard, CodedError)
}

type ClassroomRepository interface {
	CreateClassroom(c context.Context, creatorID primitive.ObjectID, classroom Classroom) CodedError
	DeleteClassroom(c context.Context, classroomID string) CodedError
	FindClassroom(c context.Context, classroomID string) (Classroom, CodedError)
	AddPost(c context.Context, classroomID string, post Post) (string, CodedError)
	UpdatePost(c context.Context, classroomID string, postID string, post dtos.UpdatePostDTO) CodedError
	RemovePost(c context.Context, classroomID string, postID string) CodedError
	AddComment(c context.Context, classroomID string, postID string, comment Comment) CodedError
	FindPost(c context.Context, classroomID string, postID string) (Post, CodedError)
	RemoveComment(c context.Context, classroomID string, postID string, commentID string) CodedError
	StringifyID(id primitive.ObjectID) string
	ParseID(id string) (primitive.ObjectID, CodedError)
	AddGrade(c context.Context, classroomID string, studentID string, studentGrade []StudentRecord) CodedError
	RemoveGrade(c context.Context, classroomID string, studentID string) CodedError
	AddStudent(c context.Context, studentID string, classroomID string) CodedError
	RemoveStudent(c context.Context, studentID string, classroomID string) CodedError
	GetClassrooms(c context.Context, userID string) ([]Classroom, CodedError)
}

type StudyGroupUsecase interface {
	CreateStudyGroup(c context.Context, creatorID string, studyGroup StudyGroup) CodedError
	DeleteStudyGroup(c context.Context, studentID string, studyGroupID string) CodedError
	AddPost(c context.Context, creatorID string, studyGroupID string, post Post) CodedError
	UpdatePost(c context.Context, creatorID string, studyGroupID string, postID string, post dtos.UpdatePostDTO) CodedError
	RemovePost(c context.Context, creatorID string, studyGroupID string, postID string) CodedError
	AddComment(c context.Context, creatorID string, studyGroupID string, postID string, comment Comment) CodedError
	RemoveComment(c context.Context, creatorID string, studyGroupID string, postID string, commentID string) CodedError
	AddStudent(c context.Context, tokenID string, studentEmail string, studyGroupID string) CodedError
	RemoveStudent(c context.Context, tokenID string, studyGroupID string, studentID string) CodedError
	GetStudyGroups(c context.Context, tokenID string) ([]StudyGroup, CodedError)
}

type StudyGroupRepository interface {
	CreateStudyGroup(c context.Context, creatorID primitive.ObjectID, studyGroup StudyGroup) CodedError
	DeleteStudyGroup(c context.Context, studyGroupID string) CodedError
	FindStudyGroup(c context.Context, studyGroupID string) (StudyGroup, CodedError)
	AddPost(c context.Context, studyGroupID string, post Post) CodedError
	UpdatePost(c context.Context, studyGroupID string, postID string, post dtos.UpdatePostDTO) CodedError
	RemovePost(c context.Context, studyGroupID string, postID string) CodedError
	AddComment(c context.Context, studyGroupID string, postID string, comment Comment) CodedError
	FindPost(c context.Context, studyGroupID string, postID string) (Post, CodedError)
	RemoveComment(c context.Context, studyGroupID string, postID string, commentID string) CodedError
	AddStudent(c context.Context, studentID string, classroomID string) CodedError
	RemoveStudent(c context.Context, studentID string, classroomID string) CodedError
	GetStudyGroups(c context.Context, userID string) ([]StudyGroup, CodedError)
	StringifyID(id primitive.ObjectID) string
	ParseID(id string) (primitive.ObjectID, CodedError)
}

type ResourceRespository interface {
	AddResource(c context.Context, content GenerateContent, postID string) CodedError
	RemoveResource(c context.Context, resourceID string) CodedError
	RemoveResourceByPostID(c context.Context, postID string) CodedError
	ParseID(id string) (primitive.ObjectID, CodedError)
	GetResourceByPostID(c context.Context, postID string) (GenerateContent, CodedError)
}

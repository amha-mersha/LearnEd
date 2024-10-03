package controllers

import (
	"learned-api/delivery/env"
	"learned-api/domain"
	"learned-api/domain/dtos"
	"net/http"
	"os"
	"path/filepath"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type ClassroomController struct {
	usecase domain.ClassroomUsecase
}

func NewClassroomController(usecase domain.ClassroomUsecase) *ClassroomController {
	return &ClassroomController{
		usecase: usecase,
	}
}

func (controller *ClassroomController) CreateClassroom(c *gin.Context) {
	var classroom domain.Classroom
	if err := c.ShouldBindJSON(&classroom); err != nil {
		c.JSON(http.StatusBadRequest, domain.Response{"error": err.Error()})
		return
	}

	id, exists := c.Keys["id"]
	if !exists {
		c.JSON(http.StatusForbidden, domain.Response{"message": "coudn't find the id field"})
		return
	}

	creatorID := id.(string)
	err := controller.usecase.CreateClassroom(c, creatorID, classroom)
	if err != nil {
		c.JSON(GetHTTPErrorCode(err), domain.Response{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, domain.Response{"message": "Classroom created successfully"})
}

func (controller *ClassroomController) DeleteClassroom(c *gin.Context) {
	classroomID := c.Param("classroomID")
	if classroomID == "" {
		c.JSON(http.StatusBadRequest, domain.Response{"error": "missing classroom id"})
		return
	}

	id, exists := c.Keys["id"]
	if !exists {
		c.JSON(http.StatusForbidden, domain.Response{"message": "coudn't find the id field"})
		return
	}

	creatorID := id.(string)
	err := controller.usecase.DeleteClassroom(c, creatorID, classroomID)
	if err != nil {
		c.JSON(GetHTTPErrorCode(err), domain.Response{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, domain.Response{"message": "classroom deleted successfully"})
}

func (controller *ClassroomController) AddPost(c *gin.Context) {
	var savePath string
	file, err := c.FormFile("file")
	if err != nil && err != http.ErrMissingFile {
		c.String(http.StatusBadRequest, "Failed to upload file: "+err.Error())
		return
	}
	var fileURL string
	if err != http.ErrMissingFile {
		fileURL = "/api/" + env.ENV.ROUTEPREFIX + "/classrooms" + file.Filename
	} else {
		fileURL = ""
	}
	if file != nil {
		workingDir, _ := os.Getwd()
		uniqueFileName := uuid.New().String() + filepath.Ext(file.Filename)
		savePath = filepath.Join(workingDir, "uploads", uniqueFileName)
		if err := c.SaveUploadedFile(file, savePath); err != nil {
			c.String(http.StatusInternalServerError, "Failed to save file")
			return
		}
	}
	var post domain.Post
	post.Content = c.PostForm("content")
	post.IsAssignment = c.PostForm("is_assignment") == "true"
	post.IsProcessed = c.PostForm("is_processed") == "true"
	post.File = fileURL
	deadlineStr := c.PostForm("deadline")
	if deadlineStr != "" {
		parsedDeadline, err := time.Parse(time.RFC3339, deadlineStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, domain.Response{"error": "Invalid deadline format"})
			return
		}
		post.Deadline = parsedDeadline
	}
	classroomID := c.Param("classroomID")
	creatorID, exists := c.Keys["id"]
	if !exists {
		c.JSON(http.StatusForbidden, domain.Response{"message": "coudn't find the id field"})
		return
	}

	id := creatorID.(string)
	errAdd := controller.usecase.AddPost(c, id, classroomID, post)
	if errAdd != nil {
		c.JSON(GetHTTPErrorCode(errAdd), domain.Response{"error": errAdd.Error()})
		return
	}

	c.JSON(http.StatusCreated, domain.Response{"message": "post added successfully"})
}

func (controller *ClassroomController) UpdatePost(c *gin.Context) {
	var updateDto dtos.UpdatePostDTO
	if err := c.ShouldBindJSON(&updateDto); err != nil {
		c.JSON(http.StatusBadRequest, domain.Response{"error": err.Error()})
		return
	}

	classroomID := c.Param("classroomID")
	postID := c.Param("postID")
	creatorID, exists := c.Keys["id"]
	if !exists {
		c.JSON(http.StatusForbidden, domain.Response{"message": "coudn't find the id field"})
		return
	}

	id := creatorID.(string)
	err := controller.usecase.UpdatePost(c, id, classroomID, postID, updateDto)
	if err != nil {
		c.JSON(GetHTTPErrorCode(err), domain.Response{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, domain.Response{"message": "post updated successfully"})
}

func (controller *ClassroomController) RemovePost(c *gin.Context) {
	classroomID := c.Param("classroomID")
	postID := c.Param("postID")
	creatorID, exists := c.Keys["id"]
	if !exists {
		c.JSON(http.StatusForbidden, domain.Response{"message": "coudn't find the id field"})
		return
	}

	id := creatorID.(string)
	err := controller.usecase.RemovePost(c, id, classroomID, postID)
	if err != nil {
		c.JSON(GetHTTPErrorCode(err), domain.Response{"error": err.Error()})
		return
	}

	c.JSON(http.StatusNoContent, domain.Response{"message": "post removed successfully"})
}

func (controller *ClassroomController) AddComment(c *gin.Context) {
	var comment domain.Comment
	if err := c.ShouldBindJSON(&comment); err != nil {
		c.JSON(http.StatusBadRequest, domain.Response{"error": err.Error()})
		return
	}

	classroomID := c.Param("classroomID")
	postID := c.Param("postID")
	creatorID, exists := c.Keys["id"]
	if !exists {
		c.JSON(http.StatusForbidden, domain.Response{"message": "coudn't find the id field"})
		return
	}

	id := creatorID.(string)
	err := controller.usecase.AddComment(c, id, classroomID, postID, comment)
	if err != nil {
		c.JSON(GetHTTPErrorCode(err), domain.Response{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, domain.Response{"message": "comment added successfully"})
}

func (controller *ClassroomController) RemoveComment(c *gin.Context) {
	classroomID := c.Param("classroomID")
	postID := c.Param("postID")
	commentID := c.Param("commentID")
	creatorID, exists := c.Keys["id"]
	if !exists {
		c.JSON(http.StatusForbidden, domain.Response{"message": "coudn't find the id field"})
		return
	}

	id := creatorID.(string)
	err := controller.usecase.RemoveComment(c, id, classroomID, postID, commentID)
	if err != nil {
		c.JSON(GetHTTPErrorCode(err), domain.Response{"error": err.Error()})
		return
	}

	c.JSON(http.StatusNoContent, domain.Response{"message": "comment removed successfully"})
}

func (controller *ClassroomController) PutGrade(c *gin.Context) {
	var gradeDto dtos.GradeDTO
	classroomID := c.Param("classroomID")
	studentID := c.Param("studentID")
	creatorID, exists := c.Keys["id"]
	if !exists {
		c.JSON(http.StatusForbidden, domain.Response{"message": "coudn't find the id field"})
		return
	}

	if err := c.ShouldBindJSON(&gradeDto); err != nil {
		c.JSON(http.StatusBadRequest, domain.Response{"error": err.Error()})
		return
	}

	id := creatorID.(string)
	err := controller.usecase.PutGrade(c, id, classroomID, studentID, gradeDto)
	if err != nil {
		c.JSON(GetHTTPErrorCode(err), domain.Response{"error": err.Error()})
		return
	}

	c.JSON(http.StatusNoContent, domain.Response{"message": "grade updated successfully"})
}

func (controller *ClassroomController) AddStudent(c *gin.Context) {
	var addStudentDto dtos.AddStudentDTO
	classroomID := c.Param("classroomID")
	if err := c.ShouldBindJSON(&addStudentDto); err != nil {
		c.JSON(http.StatusBadRequest, domain.Response{"error": err.Error()})
		return
	}

	creatorID, exists := c.Keys["id"]
	if !exists {
		c.JSON(http.StatusForbidden, domain.Response{"message": "coudn't find the id field"})
		return
	}

	id := creatorID.(string)
	err := controller.usecase.AddStudent(c, id, addStudentDto.Email, classroomID)
	if err != nil {
		c.JSON(GetHTTPErrorCode(err), domain.Response{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, domain.Response{"message": "student added to classroom successfully"})
}

func (controller *ClassroomController) RemoveStudent(c *gin.Context) {
	classroomID := c.Param("classroomID")
	studentID := c.Param("studentID")
	creatorID, exists := c.Keys["id"]
	if !exists {
		c.JSON(http.StatusForbidden, domain.Response{"message": "coudn't find the id field"})
		return
	}

	id := creatorID.(string)
	err := controller.usecase.RemoveStudent(c, id, classroomID, studentID)
	if err != nil {
		c.JSON(GetHTTPErrorCode(err), domain.Response{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, domain.Response{"message": "student removed from classroom successfully"})
}

func (controller *ClassroomController) GetGrades(c *gin.Context) {
	classroomID := c.Param("classroomID")
	creatorID, exists := c.Keys["id"]
	if !exists {
		c.JSON(http.StatusForbidden, domain.Response{"message": "coudn't find the id field"})
		return
	}

	id := creatorID.(string)
	grades, err := controller.usecase.GetGrades(c, id, classroomID)
	if err != nil {
		c.JSON(GetHTTPErrorCode(err), domain.Response{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, grades)
}

func (controller *ClassroomController) GetStudentGrade(c *gin.Context) {
	classroomID := c.Param("classroomID")
	studentID := c.Param("studentID")
	creatorID, exists := c.Keys["id"]
	if !exists {
		c.JSON(http.StatusForbidden, domain.Response{"message": "coudn't find the id field"})
		return
	}

	id := creatorID.(string)
	grade, err := controller.usecase.GetStudentGrade(c, id, studentID, classroomID)
	if err != nil {
		c.JSON(GetHTTPErrorCode(err), domain.Response{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, grade)
}

func (controller *ClassroomController) GetPosts(c *gin.Context) {
	classroomID := c.Param("classroomID")
	creatorID, exists := c.Keys["id"]
	if !exists {
		c.JSON(http.StatusForbidden, domain.Response{"message": "coudn't find the id field"})
		return
	}

	id := creatorID.(string)
	posts, err := controller.usecase.GetPosts(c, id, classroomID)
	if err != nil {
		c.JSON(GetHTTPErrorCode(err), domain.Response{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, posts)
}

func (controller *ClassroomController) GetClassrooms(c *gin.Context) {
	creatorID, exists := c.Keys["id"]
	if !exists {
		c.JSON(http.StatusForbidden, domain.Response{"message": "coudn't find the id field"})
		return
	}

	id := creatorID.(string)
	classrooms, err := controller.usecase.GetClassrooms(c, id)
	if err != nil {
		c.JSON(GetHTTPErrorCode(err), domain.Response{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, classrooms)
}

func (controlller *ClassroomController) GetGradeReport(c *gin.Context) {
	studentID := c.Param("studentID")
	creatorID, exists := c.Keys["id"]
	if !exists {
		c.JSON(http.StatusForbidden, domain.Response{"message": "coudn't find the id field"})
		return
	}

	id := creatorID.(string)
	gradeReport, err := controlller.usecase.GetGradeReport(c, id, studentID)
	if err != nil {
		c.JSON(GetHTTPErrorCode(err), domain.Response{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gradeReport)
}

func (controller *ClassroomController) EnhanceContent(c *gin.Context) {
	var requestLoad dtos.EnhanceContentDTO
	if err := c.ShouldBindJSON(&requestLoad); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}
	result, err := controller.usecase.EnhanceContent(requestLoad.CurrentState, requestLoad.Query)
	if err != nil {
		c.JSON(GetHTTPErrorCode(err), domain.Response{"error": err.Error()})
	}
	c.JSON(http.StatusOK, gin.H{"message": result})
}

func (controller *ClassroomController) GetQuiz(c *gin.Context) {
	postID := c.Param("postID")
	if response, err := controller.usecase.GetQuiz(c, postID); err != nil {
		c.JSON(GetHTTPErrorCode(err), domain.Response{"error": err.Error()})
		return
	} else {
		c.JSON(http.StatusOK, gin.H{"message": response})
	}
}

func (controller *ClassroomController) GetSummary(c *gin.Context) {
	postID := c.Param("postID")
	if response, err := controller.usecase.GetSummary(c, postID); err != nil {
		c.JSON(GetHTTPErrorCode(err), domain.Response{"error": err.Error()})
		return
	} else {
		c.JSON(http.StatusOK, gin.H{"message": response})
	}
}

func (controller *ClassroomController) GetFlashCard(c *gin.Context) {
	postID := c.Param("postID")
	if response, err := controller.usecase.GetFlashCard(c, postID); err != nil {
		c.JSON(GetHTTPErrorCode(err), domain.Response{"error": err.Error()})
		return
	} else {
		c.JSON(http.StatusOK, gin.H{"message": response})
	}
}

package controllers

import (
	"learned-api/domain"
	"learned-api/domain/dtos"
	"net/http"

	"github.com/gin-gonic/gin"
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
	var post domain.Post
	if err := c.ShouldBindJSON(&post); err != nil {
		c.JSON(http.StatusBadRequest, domain.Response{"error": err.Error()})
		return
	}

	classroomID := c.Param("classroomID")
	creatorID, exists := c.Keys["id"]
	if !exists {
		c.JSON(http.StatusForbidden, domain.Response{"message": "coudn't find the id field"})
		return
	}

	id := creatorID.(string)
	err := controller.usecase.AddPost(c, id, classroomID, post)
	if err != nil {
		c.JSON(GetHTTPErrorCode(err), domain.Response{"error": err.Error()})
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

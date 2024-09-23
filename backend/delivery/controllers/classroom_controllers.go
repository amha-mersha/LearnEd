package controllers

import (
	"learned-api/domain"
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
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	id, exists := c.Keys["id"]
	if !exists {
		c.JSON(http.StatusForbidden, gin.H{"message": "coudn't find the id field"})
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
	classroomID := c.Param("id")
	if classroomID == "" {
		c.JSON(http.StatusBadRequest, domain.Response{"error": "missing classroom id"})
		return
	}

	id, exists := c.Keys["id"]
	if !exists {
		c.JSON(http.StatusForbidden, gin.H{"message": "coudn't find the id field"})
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
	classroomID := c.Param("classroomID")
	creatorID, exists := c.Keys["id"]
	if !exists {
		c.JSON(http.StatusForbidden, gin.H{"message": "coudn't find the id field"})
		return
	}

	id := creatorID.(string)
	err := controller.usecase.AddPost(c, id, classroomID)
	if err != nil {
		c.JSON(GetHTTPErrorCode(err), domain.Response{"error": err.Error()})
	}

	c.JSON(http.StatusCreated, domain.Response{"message": "post added successfully"})
}

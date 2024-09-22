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

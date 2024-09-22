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

func (controller *ClassroomController) CreateClaassroom(c *gin.Context) {
	var classroom domain.Classroom
	if err := c.ShouldBindJSON(&classroom); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := controller.usecase.CreateClassroom(c, classroom)
	if err != nil {
		c.JSON(GetHTTPErrorCode(err), domain.Response{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, domain.Response{"message": "Classroom created successfully"})
}

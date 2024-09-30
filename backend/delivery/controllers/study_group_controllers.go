package controllers

import (
	"learned-api/domain"
	"net/http"

	"github.com/gin-gonic/gin"
)

type StudyGroupController struct {
	usecase domain.StudyGroupUsecase
}

func NewStudyGroupController(usecase domain.StudyGroupUsecase) *StudyGroupController {
	return &StudyGroupController{
		usecase: usecase,
	}
}

func (controller *StudyGroupController) CreateStudyGroup(c *gin.Context) {
	var studyGroup domain.StudyGroup
	if err := c.ShouldBindJSON(&studyGroup); err != nil {
		c.JSON(http.StatusBadRequest, domain.Response{"error": err.Error()})
		return
	}

	id, exists := c.Keys["id"]
	if !exists {
		c.JSON(http.StatusForbidden, domain.Response{"message": "coudn't find the id field"})
		return
	}

	creatorID := id.(string)
	err := controller.usecase.CreateStudyGroup(c, creatorID, studyGroup)
	if err != nil {
		c.JSON(GetHTTPErrorCode(err), domain.Response{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, domain.Response{"message": "Classroom created successfully"})
}

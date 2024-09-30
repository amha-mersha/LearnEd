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

	c.JSON(http.StatusCreated, domain.Response{"message": "study group created successfully"})
}

func (controller *StudyGroupController) DeleteStudyGroup(c *gin.Context) {
	studyGroupID := c.Param("studyGroupID")
	if studyGroupID == "" {
		c.JSON(http.StatusBadRequest, domain.Response{"error": "missing study group id"})
		return
	}

	id, exists := c.Keys["id"]
	if !exists {
		c.JSON(http.StatusForbidden, domain.Response{"message": "coudn't find the id field"})
		return
	}

	creatorID := id.(string)
	err := controller.usecase.DeleteStudyGroup(c, creatorID, studyGroupID)
	if err != nil {
		c.JSON(GetHTTPErrorCode(err), domain.Response{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, domain.Response{"message": "study group deleted successfully"})
}

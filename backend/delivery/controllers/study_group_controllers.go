package controllers

import (
	"learned-api/domain"
	"learned-api/domain/dtos"
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

func (controller *StudyGroupController) AddPost(c *gin.Context) {
	var post domain.Post
	if err := c.ShouldBindJSON(&post); err != nil {
		c.JSON(http.StatusBadRequest, domain.Response{"error": err.Error()})
		return
	}

	studyGroupID := c.Param("studyGroupID")
	creatorID, exists := c.Keys["id"]
	if !exists {
		c.JSON(http.StatusForbidden, domain.Response{"message": "coudn't find the id field"})
		return
	}

	id := creatorID.(string)
	err := controller.usecase.AddPost(c, id, studyGroupID, post)
	if err != nil {
		c.JSON(GetHTTPErrorCode(err), domain.Response{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, domain.Response{"message": "post added successfully"})
}

func (controller *StudyGroupController) UpdatePost(c *gin.Context) {
	var updateDto dtos.UpdatePostDTO
	if err := c.ShouldBindJSON(&updateDto); err != nil {
		c.JSON(http.StatusBadRequest, domain.Response{"error": err.Error()})
		return
	}

	studyGroupID := c.Param("studyGroupID")
	postID := c.Param("postID")
	creatorID, exists := c.Keys["id"]
	if !exists {
		c.JSON(http.StatusForbidden, domain.Response{"message": "coudn't find the id field"})
		return
	}

	id := creatorID.(string)
	err := controller.usecase.UpdatePost(c, id, studyGroupID, postID, updateDto)
	if err != nil {
		c.JSON(GetHTTPErrorCode(err), domain.Response{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, domain.Response{"message": "post updated successfully"})
}

func (controller *StudyGroupController) RemovePost(c *gin.Context) {
	studyGroupID := c.Param("studyGroupID")
	postID := c.Param("postID")
	creatorID, exists := c.Keys["id"]
	if !exists {
		c.JSON(http.StatusForbidden, domain.Response{"message": "coudn't find the id field"})
		return
	}

	id := creatorID.(string)
	err := controller.usecase.RemovePost(c, id, studyGroupID, postID)
	if err != nil {
		c.JSON(GetHTTPErrorCode(err), domain.Response{"error": err.Error()})
		return
	}

	c.JSON(http.StatusNoContent, domain.Response{"message": "post removed successfully"})
}

func (controller *StudyGroupController) AddComment(c *gin.Context) {
	var comment domain.Comment
	if err := c.ShouldBindJSON(&comment); err != nil {
		c.JSON(http.StatusBadRequest, domain.Response{"error": err.Error()})
		return
	}

	studyGroupID := c.Param("studyGroupID")
	postID := c.Param("postID")
	creatorID, exists := c.Keys["id"]
	if !exists {
		c.JSON(http.StatusForbidden, domain.Response{"message": "coudn't find the id field"})
		return
	}

	id := creatorID.(string)
	err := controller.usecase.AddComment(c, id, studyGroupID, postID, comment)
	if err != nil {
		c.JSON(GetHTTPErrorCode(err), domain.Response{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, domain.Response{"message": "comment added successfully"})
}

func (controller *StudyGroupController) RemoveComment(c *gin.Context) {
	studyGroupID := c.Param("studyGroupID")
	postID := c.Param("postID")
	commentID := c.Param("commentID")
	creatorID, exists := c.Keys["id"]
	if !exists {
		c.JSON(http.StatusForbidden, domain.Response{"message": "coudn't find the id field"})
		return
	}

	id := creatorID.(string)
	err := controller.usecase.RemoveComment(c, id, studyGroupID, postID, commentID)
	if err != nil {
		c.JSON(GetHTTPErrorCode(err), domain.Response{"error": err.Error()})
		return
	}

	c.JSON(http.StatusNoContent, domain.Response{"message": "comment removed successfully"})
}

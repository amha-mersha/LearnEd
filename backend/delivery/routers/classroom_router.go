package routers

import (
	"learned-api/delivery/controllers"
	"learned-api/domain"
	usecases "learned-api/usecase"

	"github.com/gin-gonic/gin"
)

func NewClassroomRouter(classroomRepository domain.ClassroomRepository, authRepository domain.AuthRepository, router *gin.RouterGroup) {
	classroomUsecase := usecases.NewClassroomUsecase(classroomRepository, authRepository)
	classroomController := controllers.NewClassroomController(classroomUsecase)

	router.POST("/", classroomController.CreateClassroom)
	router.DELETE("/:classroomID", classroomController.DeleteClassroom)

	router.POST("/:classroomID/posts", classroomController.AddPost)
	router.PATCH("/:classroomID/posts/:postID", classroomController.UpdatePost)
	router.DELETE("/:classroomID/posts/:postID", classroomController.RemovePost)

	router.POST("/:classroomID/posts/:postID", classroomController.AddComment)
	router.POST("/:classroomID/posts/:postID/comments/:commentID", classroomController.RemoveComment)
}

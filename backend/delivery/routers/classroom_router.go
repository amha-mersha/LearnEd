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
}

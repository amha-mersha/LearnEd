package routers

import (
	"learned-api/delivery/controllers"
	"learned-api/domain"
	"learned-api/infrastructure/middleware"
	usecases "learned-api/usecase"

	"github.com/gin-gonic/gin"
)

func NewStudyGroupRouter(studygroupRep domain.StudyGroupRepository, authRepository domain.AuthRepository, jwtService domain.JWTServiceInterface, router *gin.RouterGroup) {
	sgUsecase := usecases.NewStudyGroupUsecase(studygroupRep, authRepository)
	sgController := controllers.NewStudyGroupController(sgUsecase)

	router.POST("/", middleware.AuthMiddlewareWithRoles(jwtService, domain.RoleStudent), sgController.CreateStudyGroup)
}

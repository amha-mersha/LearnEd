package routers

import (
	"learned-api/delivery/controllers"
	"learned-api/domain"
	hashing_service "learned-api/infrastructure/hashing"
	validation_services "learned-api/infrastructure/validation"
	usecases "learned-api/usecase"

	"github.com/gin-gonic/gin"
)

func NewAuthRouter(authRepository domain.AuthRepository, jwtService domain.JWTServiceInterface, router *gin.RouterGroup) {
	authUsecase := usecases.NewAuthUsecase(
		authRepository,
		validation_services.NewAuthValidation(),
		hashing_service.NewHashingService(),
		jwtService,
	)
	authController := controllers.NewAuthController(authUsecase)

	router.POST("/signup", authController.Signup)
	router.POST("/login", authController.Login)
	router.POST("/change-password", authController.ChangePassword)
}

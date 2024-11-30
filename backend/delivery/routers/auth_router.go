package routers

import (
	"learned-api/delivery/controllers"
	"learned-api/domain"
	hashing_service "learned-api/infrastructure/hashing"
	"learned-api/infrastructure/middleware"
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

	router.POST("/signup", middleware.CORSMiddleware(), authController.Signup)
	router.POST("/login", middleware.CORSMiddleware(), authController.Login)
	router.POST("/change-password", middleware.CORSMiddleware(), authController.ChangePassword)
	router.GET("/users/:id", middleware.CORSMiddleware(), authController.GetInfo)
}

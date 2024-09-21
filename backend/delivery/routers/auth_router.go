package routers

import (
	"learned-api/delivery/controllers"
	hashing_service "learned-api/infrastructure/hashing"
	jwt_service "learned-api/infrastructure/jwt"
	validation_services "learned-api/infrastructure/validation"
	"learned-api/repository"
	usecases "learned-api/usecase"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/mongo"
)

func NewAuthRouter(collection *mongo.Collection, router *gin.RouterGroup) {
	authRouter := router.Group("/auth")

	authRepository := repository.NewAuthRepository(collection)
	authUsecase := usecases.NewAuthUsecase(
		authRepository,
		validation_services.NewAuthValidation(),
		hashing_service.NewHashingService(),
		jwt_service.NewJWTService("secret"),
	)
	authController := controllers.NewAuthController(authUsecase)

	authRouter.POST("/signup", authController.Signup)
	authRouter.POST("/login", authController.Login)
}

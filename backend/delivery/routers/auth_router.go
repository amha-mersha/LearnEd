package routers

import (
	"learned-api/delivery/controllers"
	"learned-api/delivery/env"
	"learned-api/domain"
	hashing_service "learned-api/infrastructure/hashing"
	jwt_service "learned-api/infrastructure/jwt"
	"learned-api/infrastructure/middleware"
	validation_services "learned-api/infrastructure/validation"
	"learned-api/repository"
	usecases "learned-api/usecase"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/mongo"
)

func NewAuthRouter(collection *mongo.Collection, router *gin.RouterGroup) {
	authRepository := repository.NewAuthRepository(collection)
	jwtService := jwt_service.NewJWTService(env.ENV.JWT_SECRET)
	authUsecase := usecases.NewAuthUsecase(
		authRepository,
		validation_services.NewAuthValidation(),
		hashing_service.NewHashingService(),
		jwtService,
	)
	authController := controllers.NewAuthController(authUsecase)

	router.POST("/signup", authController.Signup)
	router.POST("/login", authController.Login)
	router.POST("/change-password", middleware.AuthMiddlewareWithRoles(jwtService, domain.RoleStudent, domain.RoleStudent), authController.ChangePassword)
}

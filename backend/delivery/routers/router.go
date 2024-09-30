package routers

import (
	"fmt"
	"learned-api/delivery/env"
	"learned-api/domain"
	jwt_service "learned-api/infrastructure/jwt"
	"learned-api/repository"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/mongo"
)

func InitRouter(database *mongo.Database, port int, routePrefix string) {
	router := gin.Default()

	// services
	jwtService := jwt_service.NewJWTService(env.ENV.JWT_SECRET)

	// repositories
	authRepository := repository.NewAuthRepository(database.Collection(domain.CollectionUsers))
	classroomRepository := repository.NewClassroomRepository(database.Collection(domain.CollectionClassrooms))

	authRouter := router.Group("/api/" + routePrefix + "/auth")
	NewAuthRouter(authRepository, jwtService, authRouter)

	classroomRouter := router.Group("/api/" + routePrefix + "/classrooms")
	NewClassroomRouter(classroomRepository, authRepository, jwtService, classroomRouter)

	sgRouter := router.Group("/api/" + routePrefix + "/study-group")
	NewStudyGroupRepository()

	router.Run(fmt.Sprintf(":%v", port))
}

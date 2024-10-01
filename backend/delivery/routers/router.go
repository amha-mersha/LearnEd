package routers

import (
	"fmt"
	"learned-api/delivery/env"
	"learned-api/domain"
	jwt_service "learned-api/infrastructure/jwt"
	"learned-api/repository"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/mongo"
)

func InitRouter(database *mongo.Database, port int, routePrefix string) {
	router := gin.Default()

	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           time.Hour,
	}))

	// services
	jwtService := jwt_service.NewJWTService(env.ENV.JWT_SECRET)

	// repositories
	authRepository := repository.NewAuthRepository(database.Collection(domain.CollectionUsers))
	classroomRepository := repository.NewClassroomRepository(database.Collection(domain.CollectionClassrooms))
	sgRepository := repository.NewStudyGroupRepository(database.Collection(domain.CollectionStudyGroup))

	authRouter := router.Group("/api/" + routePrefix + "/auth")
	NewAuthRouter(authRepository, jwtService, authRouter)

	classroomRouter := router.Group("/api/" + routePrefix + "/classrooms")
	NewClassroomRouter(classroomRepository, authRepository, jwtService, classroomRouter)

	sgRouter := router.Group("/api/" + routePrefix + "/study-group")
	NewStudyGroupRouter(sgRepository, authRepository, jwtService, sgRouter)

	router.Run(fmt.Sprintf(":%v", port))
}

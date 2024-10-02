package routers

import (
	"context"
	"fmt"
	"learned-api/delivery/env"
	"learned-api/domain"
	ai_service "learned-api/infrastructure/ai"
	jwt_service "learned-api/infrastructure/jwt"
	"learned-api/repository"
	"os"
	"path/filepath"
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
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
	}))

	// services
	jwtService := jwt_service.NewJWTService(env.ENV.JWT_SECRET)

	// repositories
	authRepository := repository.NewAuthRepository(database.Collection(domain.CollectionUsers))
	classroomRepository := repository.NewClassroomRepository(database.Collection(domain.CollectionClassrooms))
	sgRepository := repository.NewStudyGroupRepository(database.Collection(domain.CollectionStudyGroup))
	resourceRepository := repository.NewResourceRepository(database.Collection(domain.CollectionResources))

	authRouter := router.Group("/api/" + routePrefix + "/auth")
	NewAuthRouter(authRepository, jwtService, authRouter)

	classroomRouter := router.Group("/api/" + routePrefix + "/classrooms")
	workingDir, _ := os.Getwd()
	classroomRouter.Static("/uploads", filepath.Join(workingDir, "uploads"))
	aiService := ai_service.NewAIService(context.TODO(), env.ENV.GEMINI_KEY)
	
	sgRouter := router.Group("/api/" + routePrefix + "/study-groups")
	NewStudyGroupRouter(sgRepository, authRepository, jwtService, sgRouter)NewClassroomRouter(classroomRepository, resourceRepository, authRepository, jwtService, aiService, classroomRouter)

	router.Run(fmt.Sprintf(":%v", port))
}

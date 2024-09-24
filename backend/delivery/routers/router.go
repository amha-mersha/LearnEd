package routers

import (
	"fmt"
	"learned-api/domain"
	"learned-api/repository"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/mongo"
)

func InitRouter(database *mongo.Database, port int, routePrefix string) {
	router := gin.Default()

	// repositories
	authRepository := repository.NewAuthRepository(database.Collection(domain.CollectionUsers))
	classroomRepository := repository.NewClassroomRepository(database.Collection(domain.CollectionClassrooms))

	authRouter := router.Group("/api/" + routePrefix + "/auth")
	NewAuthRouter(authRepository, authRouter)

	classroomRouter := router.Group("/api/" + routePrefix + "/classrooms")
	NewClassroomRouter(classroomRepository, authRepository, classroomRouter)

	router.Run(fmt.Sprintf(":%v", port))
}

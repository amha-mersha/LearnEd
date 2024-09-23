package routers

import (
	"fmt"
	"learned-api/domain"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/mongo"
)

func InitRouter(database *mongo.Database, port int, routePrefix string) {
	router := gin.Default()

	authRouter := router.Group("/api/" + routePrefix + "/auth")
	NewAuthRouter(database.Collection(domain.CollectionUsers), authRouter)

	router.Run(fmt.Sprintf(":%v", port))
}

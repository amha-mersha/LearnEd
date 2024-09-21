package routers

import (
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/mongo"
)

func NewAuthRouter(collection *mongo.Collection, router *gin.RouterGroup) {
	authRouter := router.Group("/auth")
	authRouter.POST("/signup", func(c *gin.Context) {})
	authRouter.POST("/login", func(c *gin.Context) {})
}

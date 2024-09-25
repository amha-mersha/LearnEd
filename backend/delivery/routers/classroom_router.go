package routers

import (
	"learned-api/delivery/controllers"
	"learned-api/domain"
	"learned-api/infrastructure/middleware"
	usecases "learned-api/usecase"

	"github.com/gin-gonic/gin"
)

func NewClassroomRouter(classroomRepository domain.ClassroomRepository, authRepository domain.AuthRepository, jwtService domain.JWTServiceInterface, router *gin.RouterGroup) {
	classroomUsecase := usecases.NewClassroomUsecase(classroomRepository, authRepository)
	classroomController := controllers.NewClassroomController(classroomUsecase)

	router.POST("/", middleware.AuthMiddlewareWithRoles(jwtService, domain.RoleTeacher), classroomController.CreateClassroom)
	router.DELETE("/:classroomID", middleware.AuthMiddlewareWithRoles(jwtService, domain.RoleTeacher), classroomController.DeleteClassroom)

	router.POST("/:classroomID/posts", middleware.AuthMiddlewareWithRoles(jwtService, domain.RoleTeacher), classroomController.AddPost)
	router.PATCH("/:classroomID/posts/:postID", middleware.AuthMiddlewareWithRoles(jwtService, domain.RoleTeacher), classroomController.UpdatePost)
	router.DELETE("/:classroomID/posts/:postID", middleware.AuthMiddlewareWithRoles(jwtService, domain.RoleTeacher), classroomController.RemovePost)

	router.POST("/:classroomID/posts/:postID", middleware.AuthMiddlewareWithRoles(jwtService, domain.RoleTeacher, domain.RoleStudent), classroomController.AddComment)
	router.DELETE("/:classroomID/posts/:postID/comments/:commentID", middleware.AuthMiddlewareWithRoles(jwtService, domain.RoleTeacher, domain.RoleStudent), classroomController.RemoveComment)

	router.PUT("/:classroomID/grades/:studentID", middleware.AuthMiddlewareWithRoles(jwtService, domain.RoleTeacher), classroomController.PutGrade)
}

package routers

import (
	"learned-api/delivery/controllers"
	"learned-api/domain"
	"learned-api/infrastructure/middleware"
	usecases "learned-api/usecase"

	"github.com/gin-gonic/gin"
)

func NewStudyGroupRouter(studygroupRep domain.StudyGroupRepository, authRepository domain.AuthRepository, jwtService domain.JWTServiceInterface, router *gin.RouterGroup) {
	sgUsecase := usecases.NewStudyGroupUsecase(studygroupRep, authRepository)
	sgController := controllers.NewStudyGroupController(sgUsecase)

	router.POST("/", middleware.AuthMiddlewareWithRoles(jwtService, domain.RoleTeacher), sgController.CreateStudyGroup)
	router.DELETE("/:studyGroupID", middleware.AuthMiddlewareWithRoles(jwtService, domain.RoleTeacher), sgController.DeleteStudyGroup)
	router.POST("/:studyGroupID/students", middleware.AuthMiddlewareWithRoles(jwtService, domain.RoleTeacher), sgController.AddStudent)
	router.DELETE("/:studyGroupID/students/:studentID", middleware.AuthMiddlewareWithRoles(jwtService, domain.RoleTeacher), sgController.RemoveStudent)

	router.POST("/:studyGroupID/posts", middleware.AuthMiddlewareWithRoles(jwtService, domain.RoleTeacher), sgController.AddPost)
	router.PATCH("/:studyGroupID/posts/:postID", middleware.AuthMiddlewareWithRoles(jwtService, domain.RoleTeacher), sgController.UpdatePost)
	router.DELETE("/:studyGroupID/posts/:postID", middleware.AuthMiddlewareWithRoles(jwtService, domain.RoleTeacher), sgController.RemovePost)

	router.POST("/:studyGroupID/posts/:postID", middleware.AuthMiddlewareWithRoles(jwtService, domain.RoleTeacher, domain.RoleStudent), sgController.AddComment)
	router.DELETE("/:studyGroupID/posts/:postID/comments/:commentID", middleware.AuthMiddlewareWithRoles(jwtService, domain.RoleTeacher, domain.RoleStudent), sgController.RemoveComment)

	router.GET("/", middleware.AuthMiddlewareWithRoles(jwtService, domain.RoleStudent, domain.RoleTeacher), sgController.GetStudyGroup)
}

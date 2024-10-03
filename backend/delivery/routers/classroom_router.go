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
	router.POST("/:classroomID/students", middleware.AuthMiddlewareWithRoles(jwtService, domain.RoleTeacher), classroomController.AddStudent)
	router.DELETE("/:classroomID/students/:studentID", middleware.AuthMiddlewareWithRoles(jwtService, domain.RoleTeacher), classroomController.RemoveStudent)

	router.POST("/:classroomID/posts", middleware.AuthMiddlewareWithRoles(jwtService, domain.RoleTeacher), classroomController.AddPost)
	router.PATCH("/:classroomID/posts/:postID", middleware.AuthMiddlewareWithRoles(jwtService, domain.RoleTeacher), classroomController.UpdatePost)
	router.DELETE("/:classroomID/posts/:postID", middleware.AuthMiddlewareWithRoles(jwtService, domain.RoleTeacher), classroomController.RemovePost)

	router.POST("/:classroomID/posts/:postID/comments", middleware.AuthMiddlewareWithRoles(jwtService, domain.RoleTeacher, domain.RoleStudent), classroomController.AddComment)
	router.DELETE("/:classroomID/posts/:postID/comments/:commentID", middleware.AuthMiddlewareWithRoles(jwtService, domain.RoleTeacher, domain.RoleStudent), classroomController.RemoveComment)

	router.PUT("/:classroomID/grades/:studentID", middleware.AuthMiddlewareWithRoles(jwtService, domain.RoleTeacher), classroomController.PutGrade)
	router.GET("/:classroomID/grades", middleware.AuthMiddlewareWithRoles(jwtService, domain.RoleTeacher), classroomController.GetGrades)
	router.GET("/:classroomID/grades/:studentID", middleware.AuthMiddlewareWithRoles(jwtService, domain.RoleStudent, domain.RoleTeacher), classroomController.GetStudentGrade)
	router.GET("/grades/:studentID", middleware.AuthMiddlewareWithRoles(jwtService, domain.RoleStudent), classroomController.GetGradeReport)
	router.GET("/:classroomID/posts", middleware.AuthMiddlewareWithRoles(jwtService, domain.RoleStudent, domain.RoleTeacher), classroomController.GetPosts)
	router.GET("/", middleware.AuthMiddlewareWithRoles(jwtService, domain.RoleStudent, domain.RoleTeacher), classroomController.GetClassrooms)
	router.POST("/enhance_content", middleware.AuthMiddlewareWithRoles(jwtService, domain.RoleTeacher), classroomController.EnhanceContent)
	router.GET("/posts/get_quiz/:postID", classroomController.GetQuiz)
	router.GET("/posts/get_summary/:postID", classroomController.GetSummary)
	router.GET("/posts/get_flashcard/:postID", classroomController.GetFlashCard)
}

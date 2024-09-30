package routers

import (
	"learned-api/domain"

	"github.com/gin-gonic/gin"
)

func NewStudyGroupRepository(studygroupRep domain.StudyGroupRepository, authRepository domain.AuthRepository, jwtService domain.JWTServiceInterface, router *gin.RouterGroup) {

}

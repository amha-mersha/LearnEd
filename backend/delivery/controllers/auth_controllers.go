package controllers

import (
	"learned-api/domain"
	"net/http"

	"github.com/gin-gonic/gin"
)

type AuthController struct {
	usecase domain.AuthUsecase
}

func GetHTTPErrorCode(err domain.CodedError) int {
	switch err.GetCode() {
	case domain.ERR_BAD_REQUEST:
		return http.StatusBadRequest
	case domain.ERR_UNAUTHORIZED:
		return http.StatusUnauthorized
	case domain.ERR_FORBIDDEN:
		return http.StatusForbidden
	case domain.ERR_NOT_FOUND:
		return http.StatusNotFound
	case domain.ERR_CONFLICT:
		return http.StatusConflict
	default:
		return http.StatusInternalServerError
	}
}

func NewAuthController(usecase domain.AuthUsecase) *AuthController {
	return &AuthController{
		usecase: usecase,
	}
}

func (controller *AuthController) Signup(c *gin.Context) {

}

func (controller *AuthController) Login(c *gin.Context) {

}

package controllers

import (
	"learned-api/domain"
	"learned-api/domain/dtos"
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
	var signupDto dtos.SignupDTO
	if err := c.ShouldBindJSON(&signupDto); err != nil {
		c.JSON(http.StatusBadRequest, domain.Response{"error": err.Error()})
		return
	}

	sErr := controller.usecase.Signup(c, signupDto)
	if sErr != nil {
		c.JSON(GetHTTPErrorCode(sErr), domain.Response{"error": sErr.Error()})
		return
	}

	c.JSON(http.StatusCreated, domain.Response{"message": "User created successfully"})
}

func (controller *AuthController) Login(c *gin.Context) {

}

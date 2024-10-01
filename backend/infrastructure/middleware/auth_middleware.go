package middleware

import (
	"fmt"
	"learned-api/domain"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
)

func SetMiddlewareError(c *gin.Context, statusCode int, message string) {
	c.JSON(statusCode, domain.Response{"message": message})
	c.Abort()
}

func AuthMiddlewareWithRoles(jwtService domain.JWTServiceInterface, validRoles ...string) gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			SetMiddlewareError(c, http.StatusUnauthorized, "Authorization header not found")
			return
		}

		headerSegments := strings.Split(authHeader, " ")
		if len(headerSegments) != 2 || strings.ToLower(headerSegments[0]) != "bearer" {
			SetMiddlewareError(c, http.StatusUnauthorized, "Authorization header is invalid")
			return
		}

		token, validErr := jwtService.ValidateAndParseToken(headerSegments[1])
		if validErr != nil {
			SetMiddlewareError(c, http.StatusUnauthorized, validErr.Error())
			return
		}

		tokenType, err := jwtService.GetTokenType(token)
		if err != nil {
			SetMiddlewareError(c, http.StatusUnauthorized, err.Error())
			return
		}

		if tokenType != "accessToken" {
			SetMiddlewareError(c, http.StatusUnauthorized, "Invalid token type: make sure to use the accessToken to authorize actions")
			return
		}

		expiresAtTime, err := jwtService.GetExpiryDate(token)
		if err != nil {
			SetMiddlewareError(c, http.StatusUnauthorized, err.Error())
			return
		}

		if expiresAtTime.Compare(time.Now()) == -1 {
			SetMiddlewareError(c, http.StatusUnauthorized, "Token expired")
			return
		}

		userRole, err := jwtService.GetRole(token)
		if err != nil {
			SetMiddlewareError(c, http.StatusUnauthorized, err.Error())
			return
		}

		id, err := jwtService.GetID(token)
		if err != nil {
			SetMiddlewareError(c, http.StatusUnauthorized, err.Error())
			return
		}

		valid := false
		for _, validRole := range validRoles {
			if userRole == validRole {
				valid = true
				break
			}
		}

		if !valid {
			SetMiddlewareError(c, http.StatusForbidden, fmt.Sprintf("'%v' roles are not allowed to access this endpoint", userRole))
			return
		}

		c.Set("id", id)
		c.Next()
	}
}

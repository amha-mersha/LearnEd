package domain

import (
	"github.com/gin-gonic/gin"
)

const (
	CollectionUsers = "users"
)

const (
	RoleTeacher = "teacher"
	RoleStudent = "student"
)

type Response gin.H

type EnvironmentVariables struct {
	DB_ADDRESS  string
	DB_NAME     string
	PORT        int
	ROUTEPREFIX string
}

type User struct {
	Name     string `json:"name"`
	Email    string `json:"email"`
	Password string `json:"password"`
	Type     string `json:"type"`
}

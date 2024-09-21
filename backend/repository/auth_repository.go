package repository

import (
	"context"
	"learned-api/domain"
	"strings"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/mongo"
)

type AuthRepository struct {
	collection *mongo.Collection
}

func NewAuthRepository(collection *mongo.Collection) *AuthRepository {
	return &AuthRepository{collection: collection}
}

func (r *AuthRepository) CreateUser(c *gin.Context, user domain.User) domain.CodedError {
	_, err := r.collection.InsertOne(context.Background(), user)
	if mongo.IsDuplicateKeyError(err) && strings.Contains(err.Error(), "email") {
		return *domain.NewError("an account with that email already exists", domain.ERR_CONFLICT)
	}

	if err != nil {
		return domain.NewError("internal server error", domain.ERR_INTERNAL_SERVER)
	}

	return nil
}

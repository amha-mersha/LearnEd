package repository

import (
	"learned-api/domain"
	"strings"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

type AuthRepository struct {
	collection *mongo.Collection
}

func NewAuthRepository(collection *mongo.Collection) *AuthRepository {
	return &AuthRepository{collection: collection}
}

func (r *AuthRepository) CreateUser(c *gin.Context, user domain.User) domain.CodedError {
	_, err := r.collection.InsertOne(c, user)
	if mongo.IsDuplicateKeyError(err) && strings.Contains(err.Error(), "email") {
		return *domain.NewError("an account with that email already exists", domain.ERR_CONFLICT)
	}

	if err != nil {
		return domain.NewError("internal server error", domain.ERR_INTERNAL_SERVER)
	}

	return nil
}

func (r *AuthRepository) GetUserByEmail(c *gin.Context, email string) (domain.User, domain.CodedError) {
	var foundUser domain.User

	res := r.collection.FindOne(c, bson.D{{Key: "email", Value: email}})
	if res.Err() == mongo.ErrNoDocuments {
		return foundUser, domain.NewError("user not found", domain.ERR_NOT_FOUND)
	}

	if res.Err() != nil {
		return foundUser, domain.NewError(res.Err().Error(), domain.ERR_INTERNAL_SERVER)
	}

	err := res.Decode(&foundUser)
	if err != nil {
		return foundUser, domain.NewError(err.Error(), domain.ERR_INTERNAL_SERVER)
	}

	return foundUser, nil
}

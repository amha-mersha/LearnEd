package repository

import (
	"context"
	"learned-api/domain"
	"strings"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type AuthRepository struct {
	collection *mongo.Collection
}

func NewAuthRepository(collection *mongo.Collection) *AuthRepository {
	return &AuthRepository{collection: collection}
}

func (r *AuthRepository) CreateUser(c context.Context, user domain.User) domain.CodedError {
	user.ID = primitive.NewObjectID()
	_, err := r.collection.InsertOne(c, user)
	if mongo.IsDuplicateKeyError(err) && strings.Contains(err.Error(), "email") {
		return *domain.NewError("an account with that email already exists", domain.ERR_CONFLICT)
	}

	if err != nil {
		return domain.NewError("internal server error", domain.ERR_INTERNAL_SERVER)
	}

	return nil
}

func (r *AuthRepository) GetUserByEmail(c context.Context, email string) (domain.User, domain.CodedError) {
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

func (r *AuthRepository) GetUserByID(c context.Context, id string) (domain.User, domain.CodedError) {
	var foundUser domain.User
	userID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return foundUser, domain.NewError(err.Error(), domain.ERR_BAD_REQUEST)
	}

	res := r.collection.FindOne(c, bson.D{{Key: "_id", Value: userID}})
	if res.Err() == mongo.ErrNoDocuments {
		return foundUser, domain.NewError("user not found", domain.ERR_NOT_FOUND)
	}

	if res.Err() != nil {
		return foundUser, domain.NewError(res.Err().Error(), domain.ERR_INTERNAL_SERVER)
	}

	err = res.Decode(&foundUser)
	if err != nil {
		return foundUser, domain.NewError(err.Error(), domain.ERR_INTERNAL_SERVER)
	}

	return foundUser, nil
}

func (r *AuthRepository) UpdateUser(c context.Context, userEmail string, updateData domain.User) domain.CodedError {
	updateFields := bson.D{}
	if updateData.Name != "" {
		updateFields = append(updateFields, bson.E{Key: "name", Value: updateData.Name})
	}

	if updateData.Password != "" {
		updateFields = append(updateFields, bson.E{Key: "password", Value: updateData.Password})
	}

	res := r.collection.FindOneAndUpdate(c, bson.D{{Key: "email", Value: userEmail}}, bson.D{{Key: "$set", Value: updateFields}})
	if res.Err() == mongo.ErrNoDocuments {
		return domain.NewError("user not found", domain.ERR_NOT_FOUND)
	}

	if res.Err() != nil {
		return domain.NewError(res.Err().Error(), domain.ERR_INTERNAL_SERVER)
	}

	return nil
}

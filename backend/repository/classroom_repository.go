package repository

import (
	"context"
	"learned-api/domain"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type ClassroomRepository struct {
	collection *mongo.Collection
}

func NewClassroomController(collection *mongo.Collection) *ClassroomRepository {
	return &ClassroomRepository{
		collection: collection,
	}
}

func (repository *ClassroomRepository) FindClassroom(c context.Context, classroomID string) (domain.Classroom, error) {
	var classroom domain.Classroom
	res := repository.collection.FindOne(c, bson.D{{Key: "_id", Value: classroomID}})
	if res.Err() == mongo.ErrNoDocuments {
		return classroom, domain.NewError("classroom not found", domain.ERR_NOT_FOUND)
	}

	if res.Err() != nil {
		return classroom, res.Err()
	}

	err := res.Decode(&classroom)
	if err != nil {
		return classroom, err
	}

	return classroom, nil
}

func (repository *ClassroomRepository) CreateClassroom(c context.Context, classroom domain.Classroom) domain.CodedError {
	_, err := repository.collection.InsertOne(c, classroom)
	if err != nil {
		return domain.NewError(err.Error(), domain.ERR_INTERNAL_SERVER)
	}

	return nil
}

func (repository *ClassroomRepository) DeleteClassroom(c context.Context, classroomID string) domain.CodedError {
	_, err := repository.collection.DeleteOne(c, bson.D{{Key: "_id", Value: classroomID}})
	if err != nil {
		return domain.NewError(err.Error(), domain.ERR_INTERNAL_SERVER)
	}

	return nil
}

func (repository *ClassroomRepository) AddPost(c context.Context, classroomID string, post domain.Post) domain.CodedError {
	post.ID = primitive.NewObjectID().Hex()
	_, err := repository.collection.UpdateOne(c, bson.D{{Key: "_id", Value: classroomID}}, bson.D{{Key: "$push", Value: bson.D{{Key: "posts", Value: post}}}})
	if err == mongo.ErrNoDocuments {
		return domain.NewError("classroom not found", domain.ERR_NOT_FOUND)
	}

	if err != nil {
		return domain.NewError(err.Error(), domain.ERR_INTERNAL_SERVER)
	}

	return nil
}

func (repository *ClassroomRepository) RemovePost(c context.Context, classroomID string, postID string) domain.CodedError {
	_, err := repository.collection.UpdateOne(c, bson.D{{Key: "_id", Value: classroomID}}, bson.D{{Key: "$pull", Value: bson.D{{Key: "posts", Value: bson.D{{Key: "_id", Value: postID}}}}}})
	if err == mongo.ErrNoDocuments {
		return domain.NewError("classroom not found", domain.ERR_NOT_FOUND)
	}

	if err != nil {
		return domain.NewError(err.Error(), domain.ERR_INTERNAL_SERVER)
	}

	return nil
}

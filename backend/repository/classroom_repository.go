package repository

import (
	"context"
	"learned-api/domain"

	"go.mongodb.org/mongo-driver/bson"
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
		return classroom, domain.NewError(domain.ERR_NOT_FOUND, "classroom not found")
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

func (repository *ClassroomRepository) CreateClassroom(c context.Context, classroom domain.Classroom) error {
	_, err := repository.collection.InsertOne(c, classroom)
	if err != nil {
		return err
	}

	return nil
}

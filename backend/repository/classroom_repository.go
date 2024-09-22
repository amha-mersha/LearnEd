package repository

import (
	"context"
	"learned-api/domain"

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

func (repository *ClassroomRepository) CreateClassroom(c context.Context, classroom domain.Classroom) error {
	_, err := repository.collection.InsertOne(c, classroom)
	if err != nil {
		return err
	}

	return nil
}

package repository

import "go.mongodb.org/mongo-driver/mongo"

type StudyGroupRepository struct {
	collection *mongo.Collection
}

func NewStudyGroupRepository(collection *mongo.Collection) *StudyGroupRepository {
	return &StudyGroupRepository{
		collection: collection,
	}
}

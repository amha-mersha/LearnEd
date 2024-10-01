package repository

import (
	"context"
	"learned-api/domain"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

type StudyGroupRepository struct {
	collection *mongo.Collection
}

func NewStudyGroupRepository(collection *mongo.Collection) *StudyGroupRepository {
	return &StudyGroupRepository{
		collection: collection,
	}
}

func (repository *ClassroomRepository) FindStudyGroup(c context.Context, studyGroupID string) (domain.StudyGroup, domain.CodedError) {
	var studyGroup domain.StudyGroup
	id, pErr := repository.ParseID(studyGroupID)
	if pErr != nil {
		return studyGroup, pErr
	}

	res := repository.collection.FindOne(c, bson.D{{Key: "_id", Value: id}})
	if res.Err() == mongo.ErrNoDocuments {
		return studyGroup, domain.NewError("study group not found", domain.ERR_NOT_FOUND)
	}

	if res.Err() != nil {
		return studyGroup, domain.NewError(res.Err().Error(), domain.ERR_INTERNAL_SERVER)
	}

	err := res.Decode(&studyGroup)
	if err != nil {
		return studyGroup, domain.NewError(err.Error(), domain.ERR_INTERNAL_SERVER)
	}

	return studyGroup, nil
}

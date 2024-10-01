package repository

import (
	"context"
	"learned-api/domain"
	"learned-api/domain/dtos"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
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

func (repository *StudyGroupRepository) FindStudyGroup(c context.Context, studyGroupID string) (domain.StudyGroup, domain.CodedError) {
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

func (repository *StudyGroupRepository) CreateStudyGroup(c context.Context, creatorID primitive.ObjectID, studyGroup domain.StudyGroup) domain.CodedError {
	studyGroup.Students = []primitive.ObjectID{creatorID}
	_, err := repository.collection.InsertOne(c, studyGroup)
	if err != nil {
		return domain.NewError(err.Error(), domain.ERR_INTERNAL_SERVER)
	}

	return nil
}

func (repository *StudyGroupRepository) DeleteStudyGroup(c context.Context, studyGroupID string) domain.CodedError {
	id, pErr := repository.ParseID(studyGroupID)
	if pErr != nil {
		return pErr
	}

	_, err := repository.collection.DeleteOne(c, bson.D{{Key: "_id", Value: id}})
	if err != nil {
		return domain.NewError(err.Error(), domain.ERR_INTERNAL_SERVER)
	}

	return nil
}

func (repository *StudyGroupRepository) AddPost(c context.Context, studyGroupID string, post domain.Post) domain.CodedError {
	post.ID = primitive.NewObjectID()
	id, pErr := repository.ParseID(studyGroupID)
	if pErr != nil {
		return pErr
	}

	_, err := repository.collection.UpdateOne(c, bson.D{{Key: "_id", Value: id}}, bson.D{{Key: "$push", Value: bson.D{{Key: "posts", Value: post}}}})
	if err == mongo.ErrNoDocuments {
		return domain.NewError("study group not found not found", domain.ERR_NOT_FOUND)
	}

	if err != nil {
		return domain.NewError(err.Error(), domain.ERR_INTERNAL_SERVER)
	}

	return nil
}

func (repository *StudyGroupRepository) UpdatePost(c context.Context, studyGroupID string, postID string, updateData dtos.UpdatePostDTO) domain.CodedError {
	updateFields := bson.M{}
	if updateData.Deadline.Unix() > 0 {
		updateFields["posts.$.deadline"] = updateData.Deadline
	}

	if updateData.Content != "" {
		updateFields["posts.$.content"] = updateData.Content
	}

	id, pErr := repository.ParseID(studyGroupID)
	if pErr != nil {
		return pErr
	}

	pid, pErr := repository.ParseID(postID)
	if pErr != nil {
		return pErr
	}

	filter := bson.M{
		"_id":       id,
		"posts._id": pid,
	}

	update := bson.M{
		"$set": updateFields,
	}

	_, err := repository.collection.UpdateOne(c, filter, update)
	if err == mongo.ErrNoDocuments {
		return domain.NewError("post not found", domain.ERR_NOT_FOUND)
	}

	if err != nil {
		return domain.NewError(err.Error(), domain.ERR_INTERNAL_SERVER)
	}

	return nil
}

func (repository *StudyGroupRepository) RemovePost(c context.Context, studyGroupID string, postID string) domain.CodedError {
	id, pErr := repository.ParseID(studyGroupID)
	if pErr != nil {
		return pErr
	}

	pid, pErr := repository.ParseID(postID)
	if pErr != nil {
		return pErr
	}

	filter := bson.M{
		"_id": id,
	}

	update := bson.M{
		"$pull": bson.M{
			"posts": bson.M{
				"_id": pid,
			},
		},
	}

	res, err := repository.collection.UpdateOne(c, filter, update)
	if err == mongo.ErrNoDocuments {
		return domain.NewError("study group not found", domain.ERR_NOT_FOUND)
	}

	if res.ModifiedCount == 0 {
		return domain.NewError("post not found", domain.ERR_NOT_FOUND)
	}

	if err != nil {
		return domain.NewError(err.Error(), domain.ERR_INTERNAL_SERVER)
	}

	return nil
}
package repository

import (
	"context"
	"learned-api/domain"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type ResourceRespository struct {
	collection *mongo.Collection
}

func NewResourceRepository(collection *mongo.Collection) domain.ResourceRespository {
	return &ResourceRespository{
		collection: collection,
	}
}

func (repo *ResourceRespository) AddResource(c context.Context, content domain.GenerateContent, postID string) domain.CodedError {
	content.ID = primitive.NewObjectID()
	if genID, pErr := repo.ParseID(postID); pErr != nil {
		return pErr
	} else {
		content.PostID = genID
	}
	_, err := repo.collection.InsertOne(c, content)
	if err != nil {
		return domain.NewError(err.Error(), domain.ERR_INTERNAL_SERVER)
	}
	return nil
}

func (repo *ResourceRespository) RemoveResource(c context.Context, resourceID string) domain.CodedError {
	id, pErr := repo.ParseID(resourceID)
	if pErr != nil {
		return pErr
	}
	_, err := repo.collection.DeleteOne(c, bson.D{{Key: "_id", Value: id}})
	if err != nil {
		return domain.NewError(err.Error(), domain.ERR_INTERNAL_SERVER)
	}

	return nil
}

func (repo *ResourceRespository) RemoveResourceByPostID(c context.Context, postID string) domain.CodedError {
	id, pErr := repo.ParseID(postID)
	if pErr != nil {
		return pErr
	}
	_, err := repo.collection.DeleteOne(c, bson.D{{Key: "post_id", Value: id}})
	if err != nil {
		return domain.NewError(err.Error(), domain.ERR_INTERNAL_SERVER)
	}
	return nil
}

func (repo *ResourceRespository) GetResourceByPostID(c context.Context, postID string) (domain.GenerateContent, domain.CodedError) {
	id, pErr := repo.ParseID(postID)
	if pErr != nil {
		return domain.GenerateContent{}, pErr
	}
	var storedResources domain.GenerateContent
	err := repo.collection.FindOne(c, bson.D{{Key: "post_id", Value: id}}).Decode(&storedResources)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return domain.GenerateContent{}, domain.NewError("document not found", domain.ERR_BAD_REQUEST)
		}
		return domain.GenerateContent{}, domain.NewError(err.Error(), domain.ERR_INTERNAL_SERVER)
	}
	return storedResources, nil
}

func (repo *ResourceRespository) ParseID(id string) (primitive.ObjectID, domain.CodedError) {
	parsedID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return parsedID, domain.NewError("invalid object id "+id, domain.ERR_BAD_REQUEST)
	}
	return parsedID, nil
}
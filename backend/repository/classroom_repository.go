package repository

import (
	"context"
	"fmt"
	"learned-api/domain"
	"learned-api/domain/dtos"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type ClassroomRepository struct {
	collection *mongo.Collection
}

func NewClassroomRepository(collection *mongo.Collection) *ClassroomRepository {
	return &ClassroomRepository{
		collection: collection,
	}
}

func (repository *ClassroomRepository) FindClassroom(c context.Context, classroomID string) (domain.Classroom, domain.CodedError) {
	var classroom domain.Classroom
	id, pErr := repository.ParseID(classroomID)
	if pErr != nil {
		return classroom, pErr
	}

	res := repository.collection.FindOne(c, bson.D{{Key: "_id", Value: id}})
	if res.Err() == mongo.ErrNoDocuments {
		return classroom, domain.NewError("classroom not found", domain.ERR_NOT_FOUND)
	}

	if res.Err() != nil {
		return classroom, domain.NewError(res.Err().Error(), domain.ERR_INTERNAL_SERVER)
	}

	err := res.Decode(&classroom)
	if err != nil {
		return classroom, domain.NewError(err.Error(), domain.ERR_INTERNAL_SERVER)
	}

	return classroom, nil
}

func (repository *ClassroomRepository) CreateClassroom(c context.Context, creatorID primitive.ObjectID, classroom domain.Classroom) domain.CodedError {
	classroom.Teachers = []primitive.ObjectID{creatorID}
	classroom.Students = []primitive.ObjectID{}
	_, err := repository.collection.InsertOne(c, classroom)
	if err != nil {
		return domain.NewError(err.Error(), domain.ERR_INTERNAL_SERVER)
	}

	return nil
}

func (repository *ClassroomRepository) DeleteClassroom(c context.Context, classroomID string) domain.CodedError {
	id, pErr := repository.ParseID(classroomID)
	if pErr != nil {
		return pErr
	}

	_, err := repository.collection.DeleteOne(c, bson.D{{Key: "_id", Value: id}})
	if err != nil {
		return domain.NewError(err.Error(), domain.ERR_INTERNAL_SERVER)
	}

	return nil
}

func (repository *ClassroomRepository) AddPost(c context.Context, classroomID string, post domain.Post) domain.CodedError {
	post.ID = primitive.NewObjectID()
	id, pErr := repository.ParseID(classroomID)
	if pErr != nil {
		return pErr
	}

	fmt.Println(post)
	_, err := repository.collection.UpdateOne(c, bson.D{{Key: "_id", Value: id}}, bson.D{{Key: "$push", Value: bson.D{{Key: "posts", Value: post}}}})
	if err == mongo.ErrNoDocuments {
		return domain.NewError("classroom not found", domain.ERR_NOT_FOUND)
	}

	if err != nil {
		return domain.NewError(err.Error(), domain.ERR_INTERNAL_SERVER)
	}

	return nil
}

func (repository *ClassroomRepository) UpdatePost(c context.Context, classroomID string, postID string, updateData dtos.UpdatePostDTO) domain.CodedError {
	updateFields := bson.M{}
	if updateData.Deadline.Unix() > 0 {
		updateFields["posts.$.deadline"] = updateData.Deadline
	}

	if updateData.Content != "" {
		updateFields["posts.$.content"] = updateData.Content
	}

	id, pErr := repository.ParseID(classroomID)
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

func (repository *ClassroomRepository) RemovePost(c context.Context, classroomID string, postID string) domain.CodedError {
	id, pErr := repository.ParseID(classroomID)
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
		return domain.NewError("classroom not found", domain.ERR_NOT_FOUND)
	}

	if res.ModifiedCount == 0 {
		return domain.NewError("post not found", domain.ERR_NOT_FOUND)
	}

	if err != nil {
		return domain.NewError(err.Error(), domain.ERR_INTERNAL_SERVER)
	}

	return nil
}

func (repository *ClassroomRepository) AddComment(c context.Context, classroomID string, postID string, comment domain.Comment) domain.CodedError {
	comment.ID = primitive.NewObjectID()

	cID, pErr := repository.ParseID(classroomID)
	if pErr != nil {
		return pErr
	}

	pID, pErr := repository.ParseID(postID)
	if pErr != nil {
		return pErr
	}

	filter := bson.M{
		"_id":       cID,
		"posts._id": pID,
	}

	update := bson.M{
		"$push": bson.M{
			"posts.$.comments": comment,
		},
	}

	res, err := repository.collection.UpdateOne(c, filter, update)
	if err == mongo.ErrNoDocuments {
		return domain.NewError("post not found", domain.ERR_NOT_FOUND)
	}

	if res.ModifiedCount == 0 {
		return domain.NewError("post not found", domain.ERR_NOT_FOUND)
	}

	if err != nil {
		return domain.NewError(err.Error(), domain.ERR_INTERNAL_SERVER)
	}

	return nil
}

func (repository *ClassroomRepository) RemoveComment(c context.Context, classroomID string, postID string, commentID string) domain.CodedError {
	cID, pErr := repository.ParseID(classroomID)
	if pErr != nil {
		return pErr
	}

	pID, pErr := repository.ParseID(postID)
	if pErr != nil {
		return pErr
	}

	coID, pErr := repository.ParseID(commentID)
	if pErr != nil {
		return pErr
	}

	filter := bson.M{
		"_id":       cID,
		"posts._id": pID,
	}

	update := bson.M{
		"$pull": bson.M{
			"posts.$.comments": bson.M{
				"_id": coID,
			},
		},
	}

	res, err := repository.collection.UpdateOne(c, filter, update)
	if err == mongo.ErrNoDocuments {
		return domain.NewError("comment not found", domain.ERR_NOT_FOUND)
	}

	if res.ModifiedCount == 0 {
		return domain.NewError("comment not found", domain.ERR_NOT_FOUND)
	}

	if err != nil {
		return domain.NewError(err.Error(), domain.ERR_INTERNAL_SERVER)
	}

	return nil
}

func (repository *ClassroomRepository) FindPost(c context.Context, classroomID string, postID string) (domain.Post, domain.CodedError) {
	classroom, err := repository.FindClassroom(c, classroomID)
	if err != nil {
		return domain.Post{}, err
	}

	for _, post := range classroom.Posts {
		if repository.StringifyID(post.ID) == postID {
			return post, nil
		}
	}

	return domain.Post{}, domain.NewError("post not found", domain.ERR_NOT_FOUND)
}

func (repository *ClassroomRepository) StringifyID(id primitive.ObjectID) string {
	return id.Hex()
}

func (repository *ClassroomRepository) ParseID(id string) (primitive.ObjectID, domain.CodedError) {
	parsedID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return parsedID, domain.NewError("invalid object id "+id, domain.ERR_BAD_REQUEST)
	}

	return parsedID, nil
}

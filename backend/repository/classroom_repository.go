package repository

import (
	"context"
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
	res := repository.collection.FindOne(c, bson.D{{Key: "_id", Value: classroomID}})
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

func (repository *ClassroomRepository) CreateClassroom(c context.Context, creatorID string, classroom domain.Classroom) domain.CodedError {
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

func (repository *ClassroomRepository) UpdatePost(c context.Context, classroomID string, postID string, updateData dtos.UpdatePostDTO) domain.CodedError {
	updateFields := bson.D{}
	if updateData.Deadline.Unix() != 0 {
		updateFields = append(updateFields, bson.E{Key: "deadline", Value: updateData.Deadline})
	}

	if updateData.Content != "" {
		updateFields = append(updateFields, bson.E{Key: "content", Value: updateData.Content})
	}

	_, err := repository.collection.UpdateOne(c, bson.D{{Key: "_id", Value: classroomID}, {Key: "posts._id", Value: postID}}, bson.D{{Key: "$set", Value: updateFields}})
	if err == mongo.ErrNoDocuments {
		return domain.NewError("post not found", domain.ERR_NOT_FOUND)
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

func (repository *ClassroomRepository) AddComment(c context.Context, classroomID string, postID string, comment domain.Comment) domain.CodedError {
	comment.ID = primitive.NewObjectID().Hex()
	_, err := repository.collection.UpdateOne(c, bson.D{{Key: "_id", Value: classroomID}, {Key: "posts._id", Value: postID}}, bson.D{{Key: "$push", Value: bson.D{{Key: "comments", Value: comment}}}})
	if err == mongo.ErrNoDocuments {
		return domain.NewError("post not found", domain.ERR_NOT_FOUND)
	}

	if err != nil {
		return domain.NewError(err.Error(), domain.ERR_INTERNAL_SERVER)
	}

	return nil
}

func (repository *ClassroomRepository) RemoveComment(c context.Context, classroomID string, postID string, commentID string) domain.CodedError {
	_, err := repository.collection.UpdateOne(c, bson.D{{Key: "_id", Value: classroomID}, {Key: "posts._id", Value: postID}}, bson.D{{Key: "$pull", Value: bson.D{{Key: "comments", Value: bson.D{{Key: "_id", Value: commentID}}}}}})
	if err == mongo.ErrNoDocuments {
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
		if post.ID == postID {
			return post, nil
		}
	}

	return domain.Post{}, domain.NewError("post not found", domain.ERR_NOT_FOUND)
}

func (repository *ClassroomRepository) StringifyID(id primitive.ObjectID) string {
	return id.String()
}

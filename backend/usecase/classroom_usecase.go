package usecases

import (
	"context"
	"learned-api/domain"
	"learned-api/domain/dtos"

	"github.com/gin-gonic/gin"
)

type ClassroomUsecase struct {
	classroomRepository domain.ClassroomRepository
	authRepository      domain.AuthRepository
}

func NewClassroomUsecase(classroomRepository domain.ClassroomRepository, authRepository domain.AuthRepository) *ClassroomUsecase {
	return &ClassroomUsecase{
		classroomRepository: classroomRepository,
		authRepository:      authRepository,
	}
}

func (usecase *ClassroomUsecase) CreateClassroom(c *gin.Context, creatorID string, classroom domain.Classroom) domain.CodedError {
	newClassroom := domain.Classroom{
		Name:     classroom.Name,
		Owner:    creatorID,
		Teachers: []string{creatorID},
	}

	if err := usecase.classroomRepository.CreateClassroom(c, newClassroom); err != nil {
		return err
	}

	return nil
}

func (usecase *ClassroomUsecase) DeleteClassroom(c context.Context, teacherID string, classroomID string) domain.CodedError {
	foundClassroom, err := usecase.classroomRepository.FindClassroom(c, classroomID)
	if err != nil {
		return err
	}

	if foundClassroom.Owner != teacherID {
		return domain.NewError("only the original owner can delete the classroom", domain.ERR_FORBIDDEN)
	}

	if err = usecase.classroomRepository.DeleteClassroom(c, classroomID); err != nil {
		return err
	}

	return nil
}

func (usecase *ClassroomUsecase) AddPost(c context.Context, creatorID string, classroomID string, post domain.Post) domain.CodedError {
	classroom, err := usecase.classroomRepository.FindClassroom(c, classroomID)
	if err != nil {
		return err
	}

	allowed := false
	for _, teacherID := range classroom.Teachers {
		if teacherID == creatorID {
			allowed = true
			break
		}
	}

	if !allowed {
		return domain.NewError("only teachers added to the classroom can add posts", domain.ERR_FORBIDDEN)
	}

	if err = usecase.classroomRepository.AddPost(c, classroomID, post); err != nil {
		return err
	}

	return nil
}

func (usecase *ClassroomUsecase) UpdatePost(c context.Context, creatorID string, classroomID string, postID string, post dtos.UpdatePostDTO) domain.CodedError {
	classroom, err := usecase.classroomRepository.FindClassroom(c, classroomID)
	if err != nil {
		return err
	}

	allowed := false
	for _, teacherID := range classroom.Teachers {
		if teacherID == creatorID {
			allowed = true
			break
		}
	}

	if !allowed {
		return domain.NewError("only teachers added to the classroom can update posts", domain.ERR_FORBIDDEN)
	}

	if err = usecase.classroomRepository.UpdatePost(c, classroomID, postID, post); err != nil {
		return err
	}

	return nil
}

func (usecase *ClassroomUsecase) RemovePost(c context.Context, creatorID string, classroomID string, postID string) domain.CodedError {
	classroom, err := usecase.classroomRepository.FindClassroom(c, classroomID)
	if err != nil {
		return err
	}

	allowed := false
	for _, teacherID := range classroom.Teachers {
		if teacherID == creatorID {
			allowed = true
			break
		}
	}

	if !allowed {
		return domain.NewError("only teachers added to the classroom can remove posts", domain.ERR_FORBIDDEN)
	}

	if err = usecase.classroomRepository.RemovePost(c, classroomID, postID); err != nil {
		return err
	}

	return nil
}

func (usecase *ClassroomUsecase) AddComment(c context.Context, creatorID string, classroomID string, postID string, comment domain.Comment) domain.CodedError {
	classroom, err := usecase.classroomRepository.FindClassroom(c, classroomID)
	if err != nil {
		return err
	}

	allowed := false
	for _, teacherID := range classroom.Teachers {
		if teacherID == creatorID {
			allowed = true
			break
		}
	}

	if !allowed {
		for _, studentID := range classroom.Students {
			if studentID == creatorID {
				allowed = true
				break
			}
		}
	}

	if !allowed {
		return domain.NewError("only teachers added to the classroom can remove posts", domain.ERR_FORBIDDEN)
	}

	user, err := usecase.authRepository.GetUserByID(c, creatorID)
	if err != nil {
		return err
	}

	comment.CreatorName = user.Name
	comment.CreatorID = user.ID
	if err = usecase.classroomRepository.AddComment(c, classroomID, postID, comment); err != nil {
		return err
	}

	return nil
}

func (usecase *ClassroomUsecase) RemoveComment(c context.Context, userID string, classroomID string, postID string, commentID string) domain.CodedError {
	_, err := usecase.classroomRepository.FindClassroom(c, classroomID)
	if err != nil {
		return err
	}

	post, err := usecase.classroomRepository.FindPost(c, classroomID, postID)
	if err != nil {
		return err
	}

	found := false
	for _, comment := range post.Comments {
		if comment.ID == commentID {
			if comment.CreatorID != userID {
				return domain.NewError("only the creator of the comment can remove it", domain.ERR_FORBIDDEN)
			}
			found = true
			break
		}
	}

	if !found {
		return domain.NewError("comment not found", domain.ERR_NOT_FOUND)
	}

	if err = usecase.classroomRepository.RemoveComment(c, classroomID, postID, commentID); err != nil {
		return err
	}

	return nil
}

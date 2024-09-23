package usecases

import (
	"context"
	"learned-api/domain"
	"learned-api/domain/dtos"

	"github.com/gin-gonic/gin"
)

type ClassroomUsecase struct {
	repository domain.ClassroomRepository
}

func NewClassroomController(repository domain.ClassroomRepository) *ClassroomUsecase {
	return &ClassroomUsecase{
		repository: repository,
	}
}

func (usecase *ClassroomUsecase) CreateClassroom(c *gin.Context, creatorID string, classroom domain.Classroom) domain.CodedError {
	newClassroom := domain.Classroom{
		Name:     classroom.Name,
		Owner:    creatorID,
		Teachers: []string{creatorID},
	}

	if err := usecase.repository.CreateClassroom(c, newClassroom); err != nil {
		return err
	}

	return nil
}

func (usecase *ClassroomUsecase) DeleteClassroom(c context.Context, teacherID string, classroomID string) domain.CodedError {
	foundClassroom, err := usecase.repository.FindClassroom(c, classroomID)
	if err != nil {
		return err
	}

	if foundClassroom.Owner != teacherID {
		return domain.NewError("only the original owner can delete the classroom", domain.ERR_FORBIDDEN)
	}

	if err = usecase.repository.DeleteClassroom(c, classroomID); err != nil {
		return err
	}

	return nil
}

func (usecase *ClassroomUsecase) AddPost(c context.Context, creatorID string, classroomID string, post domain.Post) domain.CodedError {
	classroom, err := usecase.repository.FindClassroom(c, classroomID)
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

	if err = usecase.repository.AddPost(c, classroomID, post); err != nil {
		return err
	}

	return nil
}

func (usecase *ClassroomUsecase) UpdatePost(c context.Context, creatorID string, classroomID string, postID string, post dtos.UpdatePostDTO) domain.CodedError {
	classroom, err := usecase.repository.FindClassroom(c, classroomID)
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

	if err = usecase.repository.UpdatePost(c, classroomID, postID, post); err != nil {
		return err
	}

	return nil
}

func (usecase *ClassroomUsecase) RemovePost(c context.Context, creatorID string, classroomID string, postID string) domain.CodedError {
	classroom, err := usecase.repository.FindClassroom(c, classroomID)
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

	if err = usecase.repository.RemovePost(c, classroomID, postID); err != nil {
		return err
	}

	return nil
}

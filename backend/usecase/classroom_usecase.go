package usecases

import (
	"context"
	"learned-api/domain"

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

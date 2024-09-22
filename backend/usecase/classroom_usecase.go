package usecases

import (
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

func (usecase *ClassroomUsecase) CreateClassroom(c *gin.Context, creatorEmail string, classroom domain.Classroom) domain.CodedError {
	newClassroom := domain.Classroom{
		Name:     classroom.Name,
		Owner:    creatorEmail,
		Teachers: []string{creatorEmail},
	}

	if err := usecase.repository.CreateClassroom(c, newClassroom); err != nil {
		return err
	}

	return nil
}

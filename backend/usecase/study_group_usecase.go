package usecases

import (
	"context"
	"learned-api/domain"
)

type StudyGroupUsecase struct {
	sgRepository   domain.StudyGroupRepository
	authRepository domain.AuthRepository
}

func NewStudyGroupUsecase(sgRepository domain.StudyGroupRepository, authRepository domain.AuthRepository) *StudyGroupUsecase {
	return &StudyGroupUsecase{
		sgRepository:   sgRepository,
		authRepository: authRepository,
	}
}

func (usecase *StudyGroupUsecase) CreateStudyGroup(c context.Context, creatorID string, studyGroup domain.StudyGroup) domain.CodedError {
	id, err := usecase.sgRepository.ParseID(creatorID)
	if err != nil {
		return err
	}

	newClassroom := domain.StudyGroup{
		Name:       studyGroup.Name,
		CourseName: studyGroup.CourseName,
		Owner:      id,
		Posts:      []domain.Post{},
	}

	if err := usecase.sgRepository.CreateStudyGroup(c, id, newClassroom); err != nil {
		return err
	}

	return nil
}

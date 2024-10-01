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

func (usecase *StudyGroupUsecase) DeleteStudyGroup(c context.Context, teacherID string, studyGroupID string) domain.CodedError {
	foundSG, err := usecase.sgRepository.FindStudyGroup(c, studyGroupID)
	if err != nil {
		return err
	}

	if usecase.sgRepository.StringifyID(foundSG.Owner) != teacherID {
		return domain.NewError("only the original owner can delete the classroom", domain.ERR_FORBIDDEN)
	}

	if err = usecase.sgRepository.DeleteStudyGroup(c, studyGroupID); err != nil {
		return err
	}

	return nil
}

package usecases

import "learned-api/domain"

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

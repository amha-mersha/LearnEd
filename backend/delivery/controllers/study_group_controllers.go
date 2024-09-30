package controllers

import "learned-api/domain"

type StudyGroupControllers struct {
	usecase domain.StudyGroupUsecase
}

func NewStudyGroupController(usecase domain.StudyGroupUsecase) *StudyGroupControllers {
	return &StudyGroupControllers{
		usecase: usecase,
	}
}

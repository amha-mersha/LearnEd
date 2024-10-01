package usecases

import (
	"context"
	"learned-api/domain"
	"learned-api/domain/dtos"
	"time"
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

	newSG := domain.StudyGroup{
		Name:       studyGroup.Name,
		CourseName: studyGroup.CourseName,
		Owner:      id,
		Posts:      []domain.Post{},
	}

	if err := usecase.sgRepository.CreateStudyGroup(c, id, newSG); err != nil {
		return err
	}

	return nil
}

func (usecase *StudyGroupUsecase) DeleteStudyGroup(c context.Context, studentID string, studyGroupID string) domain.CodedError {
	foundSG, err := usecase.sgRepository.FindStudyGroup(c, studyGroupID)
	if err != nil {
		return err
	}

	if usecase.sgRepository.StringifyID(foundSG.Owner) != studentID {
		return domain.NewError("only the original owner can delete the study group", domain.ERR_FORBIDDEN)
	}

	if err = usecase.sgRepository.DeleteStudyGroup(c, studyGroupID); err != nil {
		return err
	}

	return nil
}

func (usecase *StudyGroupUsecase) AddPost(c context.Context, creatorID string, studyGroupID string, post domain.Post) domain.CodedError {
	if post.Content == "" {
		return domain.NewError("post content cannot be empty", domain.ERR_BAD_REQUEST)
	}

	studyGroup, err := usecase.sgRepository.FindStudyGroup(c, studyGroupID)
	if err != nil {
		return err
	}

	allowed := false
	for _, studentID := range studyGroup.Students {
		if usecase.sgRepository.StringifyID(studentID) == creatorID {
			allowed = true
			break
		}
	}

	if !allowed {
		return domain.NewError("only students added to the study group can add posts", domain.ERR_FORBIDDEN)
	}

	cID, err := usecase.sgRepository.ParseID(creatorID)
	if err != nil {
		return err
	}

	post.Comments = []domain.Comment{}
	post.CreatedAt = time.Now().Round(0)
	post.CreatorID = cID
	if err = usecase.sgRepository.AddPost(c, studyGroupID, post); err != nil {
		return err
	}

	return nil
}

func (usecase *StudyGroupUsecase) UpdatePost(c context.Context, creatorID string, studyGroupID string, postID string, post dtos.UpdatePostDTO) domain.CodedError {
	studyGroup, err := usecase.sgRepository.FindStudyGroup(c, studyGroupID)
	if err != nil {
		return err
	}

	allowed := false
	for _, studyGroupID := range studyGroup.Students {
		if usecase.sgRepository.StringifyID(studyGroupID) == creatorID {
			allowed = true
			break
		}
	}

	if !allowed {
		return domain.NewError("only students added to the study group can update posts", domain.ERR_FORBIDDEN)
	}

	if err = usecase.sgRepository.UpdatePost(c, studyGroupID, postID, post); err != nil {
		return err
	}

	return nil
}

func (usecase *StudyGroupUsecase) RemovePost(c context.Context, creatorID string, studyGroupID string, postID string) domain.CodedError {
	studyGroup, err := usecase.sgRepository.FindStudyGroup(c, studyGroupID)
	if err != nil {
		return err
	}

	allowed := false
	for _, teacherID := range studyGroup.Students {
		if usecase.sgRepository.StringifyID(teacherID) == creatorID {
			allowed = true
			break
		}
	}

	if !allowed {
		return domain.NewError("only students added to the study group can remove posts", domain.ERR_FORBIDDEN)
	}

	if err = usecase.sgRepository.RemovePost(c, studyGroupID, postID); err != nil {
		return err
	}

	return nil
}

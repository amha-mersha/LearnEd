package usecases

import (
	"context"
	"learned-api/domain"
	"learned-api/domain/dtos"
	"time"
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

func (usecase *ClassroomUsecase) CreateClassroom(c context.Context, creatorID string, classroom domain.Classroom) domain.CodedError {
	id, err := usecase.classroomRepository.ParseID(creatorID)
	if err != nil {
		return err
	}

	newClassroom := domain.Classroom{
		Name:          classroom.Name,
		CourseName:    classroom.CourseName,
		Season:        classroom.Season,
		Owner:         id,
		Posts:         []domain.Post{},
		StudentGrades: []domain.StudentGrade{},
	}

	if err := usecase.classroomRepository.CreateClassroom(c, id, newClassroom); err != nil {
		return err
	}

	return nil
}

func (usecase *ClassroomUsecase) DeleteClassroom(c context.Context, teacherID string, classroomID string) domain.CodedError {
	foundClassroom, err := usecase.classroomRepository.FindClassroom(c, classroomID)
	if err != nil {
		return err
	}

	if usecase.classroomRepository.StringifyID(foundClassroom.Owner) != teacherID {
		return domain.NewError("only the original owner can delete the classroom", domain.ERR_FORBIDDEN)
	}

	if err = usecase.classroomRepository.DeleteClassroom(c, classroomID); err != nil {
		return err
	}

	return nil
}

func (usecase *ClassroomUsecase) AddPost(c context.Context, creatorID string, classroomID string, post domain.Post) domain.CodedError {
	if post.Content == "" {
		return domain.NewError("post content cannot be empty", domain.ERR_BAD_REQUEST)
	}

	classroom, err := usecase.classroomRepository.FindClassroom(c, classroomID)
	if err != nil {
		return err
	}

	allowed := false
	for _, teacherID := range classroom.Teachers {
		if usecase.classroomRepository.StringifyID(teacherID) == creatorID {
			allowed = true
			break
		}
	}

	if !allowed {
		return domain.NewError("only teachers added to the classroom can add posts", domain.ERR_FORBIDDEN)
	}

	post.Comments = []domain.Comment{}
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
		if usecase.classroomRepository.StringifyID(teacherID) == creatorID {
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
		if usecase.classroomRepository.StringifyID(teacherID) == creatorID {
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
	if comment.Content == "" {
		return domain.NewError("comment content cannot be empty", domain.ERR_BAD_REQUEST)
	}

	id, err := usecase.classroomRepository.ParseID(creatorID)
	if err != nil {
		return err
	}

	foundUser, err := usecase.authRepository.GetUserByID(c, creatorID)
	if err != nil {
		return err
	}

	comment.CreatedAt = time.Now().Round(0)
	comment.CreatorID = id
	comment.CreatorName = foundUser.Name
	classroom, err := usecase.classroomRepository.FindClassroom(c, classroomID)
	if err != nil {
		return err
	}

	allowed := false
	for _, teacherID := range classroom.Teachers {
		if usecase.classroomRepository.StringifyID(teacherID) == creatorID {
			allowed = true
			break
		}
	}

	if !allowed {
		for _, studentID := range classroom.Students {
			if usecase.classroomRepository.StringifyID(studentID) == creatorID {
				allowed = true
				break
			}
		}
	}

	if !allowed {
		return domain.NewError("only teachers added to the classroom can remove posts", domain.ERR_FORBIDDEN)
	}

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
		if usecase.classroomRepository.StringifyID(comment.ID) == commentID {
			if usecase.classroomRepository.StringifyID(comment.CreatorID) != userID {
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

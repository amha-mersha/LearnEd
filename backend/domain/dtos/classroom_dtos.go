package dtos

import "time"

type UpdatePostDTO struct {
	Deadline time.Time `json:"deadline"`
	Content  string    `json:"content"`
}

type GradeRecord struct {
	RecordName string `json:"record_name"`
	Grade      int    `json:"grade"`
	MaxGrade   int    `json:"max_grade"`
}

type GradeDTO struct {
	Grades []GradeRecord `json:"grades"`
}

type AddStudentDTO struct {
	Email string `json:"email"`
}

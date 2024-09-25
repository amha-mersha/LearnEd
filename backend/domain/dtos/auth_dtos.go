package dtos

type SignupDTO struct {
	Name     string `json:"name"`
	Email    string `json:"email"`
	Password string `json:"password"`
	Type     string `json:"type"`
}

type LoginDTO struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type ChangePasswordDTO struct {
	Email       string `json:"email"`
	OldPassword string `json:"old_password"`
	NewPassword string `json:"new_password"`
}

type GradeRecord struct {
	RecordName string `json:"record_name"`
	Grade      int    `json:"grade"`
	MaxGrade   int    `json:"max_grade"`
}

type GradeDTO struct {
	Grades []GradeRecord `json:"grades"`
}

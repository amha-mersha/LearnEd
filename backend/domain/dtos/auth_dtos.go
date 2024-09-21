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

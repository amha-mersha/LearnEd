package dtos

import "time"

type UpdatePostDTO struct {
	Deadline time.Time `json:"deadline"`
	Content  string    `json:"content"`
}

type QuestionDTO struct {
	Question      string   `json:"question" bson:"question"`
	Choices       []string `json:"choices" bson:"choices"`
	CorrectAnswer string   `json:"correct_answer" bson:"correct_answer"`
	Explanation   string   `json:"explanation" bson:"explanation"`
}

type SummaryDTO struct {
	Summary string `json:"summary" bson:"summary"`
}

type GenerateContentDTO struct{
	Questions []QuestionDTO `json:"questions"`
	Summarys []SummaryDTO `json:"summarys" bson:"summarys"`
}

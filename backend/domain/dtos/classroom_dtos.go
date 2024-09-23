package dtos

import "time"

type UpdatePostDTO struct {
	Deadline time.Time `json:"deadline"`
	Content  string    `json:"content"`
}

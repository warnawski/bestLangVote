package models

type Lang struct {
	Name      string `gorm:"unique"`
	CountVote int
}

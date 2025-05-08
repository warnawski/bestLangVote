package models

import "gorm.io/gorm"

type Lang struct {
	gorm.Model
	Name      string `gorm:"unique"`
	CountVote int
}

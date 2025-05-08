package models

import "gorm.io/gorm"

type User struct {
	gorm.Model
	Ipv4 string `gorm:"unique"`
	Vote bool
	Whom string
}

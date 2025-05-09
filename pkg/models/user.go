package models

type User struct {
	Ipv6 string `gorm:"unique"`
	Vote bool
	Whom string
}

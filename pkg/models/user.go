package models

type User struct {
	Anon_token string `gorm:"uniqueIndex"`
	Vote       bool
	Whom       string
}

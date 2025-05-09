package crud

import (
	"fmt"
	"voteSite/pkg/models"

	"gorm.io/gorm"
)

type UserGorm struct {
	db *gorm.DB
}

func NewUserGormRepo(db *gorm.DB) *UserGorm {
	return &UserGorm{db: db}
}

func (u *UserGorm) AddUser(Ipv6 string, whom string) error {
	user := models.User{Ipv6: Ipv6, Vote: true, Whom: whom}
	err := u.db.Create(&user).Error
	if err != nil {
		return fmt.Errorf("ошибка добавления юзера в бд: %v", err)
	}
	return nil
}

func (u *UserGorm) CheckVoteStatus(Ipv6 string) (bool, error) {
	var user models.User
	err := u.db.Where("Ipv6 = ?", Ipv6).Find(&user).Error
	if err != nil {
		return false, fmt.Errorf("ошибка получения статуса голосования юзера: %v", err)
	}
	return user.Vote, nil
}

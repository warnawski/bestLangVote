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

func (u *UserGorm) AddUser(anon_token string, whom string) error {
	user := models.User{Anon_token: anon_token, Vote: false, Whom: whom}
	err := u.db.Create(&user).Error
	if err != nil {
		return fmt.Errorf("ошибка добавления юзера в бд: %v", err)
	}
	return nil
}

func (u *UserGorm) CheckVoteStatus(anon_token string) (bool, error) {
	var user models.User
	err := u.db.Where("anon_token = ?", anon_token).Find(&user).Error
	if err != nil {
		return false, fmt.Errorf("ошибка получения статуса голосования юзера: %v", err)
	}
	return user.Vote, nil
}

func (u *UserGorm) UpdateVoteStatus(anom_token string, whom string) error {
	err := u.db.Model(&models.User{}).Where("anon_token = ?", anom_token).Updates(map[string]interface{}{
		"vote": true,
		"whom": whom,
	}).Error
	if err != nil {
		return fmt.Errorf("ошибка апдейта статуса голосования: %v", err)
	}
	return nil
}

package crud

import (
	"fmt"
	"voteSite/pkg/models"

	"gorm.io/gorm"
)

type LangGorm struct {
	db *gorm.DB
}

func NewLangGormRepo(db *gorm.DB) *LangGorm {
	return &LangGorm{db: db}
}

func (l *LangGorm) AddVote(name string) error {
	var lang models.Lang
	err := l.db.Model(&lang).Where("name = ?", name).Update("count_vote", gorm.Expr("count_vote + ?", 1)).Error
	if err != nil {
		return fmt.Errorf("ошибкаа добавления голоса языку: %v", err)
	}
	return nil
}

func (l *LangGorm) GetCountVote(name string) (int, error) {
	var lang models.Lang
	err := l.db.Where("name = ?", name).First(&lang).Error
	if err != nil {
		return 0, fmt.Errorf("ошибка получения кол-ва голосов: %v", err)
	}
	return lang.CountVote, nil
}

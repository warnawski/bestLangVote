package database

import (
	"fmt"

	"voteSite/pkg/database/config"
	dr "voteSite/pkg/database/driver"
	model "voteSite/pkg/models"

	"gorm.io/gorm"
)

func ConnectDatabase(cfg config.DBConfig) (*gorm.DB, error) {

	var db *gorm.DB
	var err error

	switch cfg.Driver {
	case "mysql":
		return nil, fmt.Errorf("Не поддерживается", err)

	case "postgresql":
		db, err = dr.ConnectPostgreSQL(cfg)

	default:
		return nil, fmt.Errorf("Ошибка подключения к базе данных")
	}

	if err != nil {
		return nil, err
	}

	err = db.AutoMigrate(
		&model.User{},
		&model.Lang{},
	)
	if err != nil {
		return nil, fmt.Errorf("Ошибка миграции", err)
	}
	return db, nil
}

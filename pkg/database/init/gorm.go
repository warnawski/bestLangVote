package database

import (
	"fmt"

	"voteSite/pkg/database/config"
	dr "voteSite/pkg/database/driver"

	"gorm.io/gorm"
)

func ConnectDatabase(cfg config.DBConfig) (*gorm.DB, error) {

	var db *gorm.DB
	var err error

	switch cfg.Driver {
	case "mysql":
		return nil, fmt.Errorf("не поддерживается: %v", err)

	case "postgresql":
		db, err = dr.ConnectPostgreSQL(cfg)
		if err != nil {
			return nil, fmt.Errorf("ошибка подключения к постгресу: %v", err)
		}

	default:
		return nil, fmt.Errorf("ошибка подключения к базе данных: %v", err)
	}
	return db, nil
}

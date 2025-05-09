package driver

import (
	"fmt"
	db "voteSite/pkg/database/config"

	model "voteSite/pkg/models"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func ConnectPostgreSQL(cfg db.DBConfig) (*gorm.DB, error) {
	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=%s", cfg.Host, cfg.User, cfg.Password, cfg.DBName, cfg.Port, cfg.SSLMode)
	db, err := gorm.Open(postgres.New(postgres.Config{
		DSN:                  dsn,
		PreferSimpleProtocol: true,
	}), &gorm.Config{})

	if err != nil {
		return nil, fmt.Errorf("ошибка подключения к Посгресу: %v", err)
	}

	err = automigrate(db)
	if err != nil {
		return nil, err
	}
	return db, nil
}

func automigrate(db *gorm.DB) error {
	if db == nil {
		return fmt.Errorf("nil db при миграции")
	}

	err := db.AutoMigrate(
		&model.User{},
		&model.Lang{},
	)
	if err != nil {
		return fmt.Errorf("ошибка миграции: %v", err)
	}
	return nil
}

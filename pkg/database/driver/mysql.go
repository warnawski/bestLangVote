package driver

import (
	db "voteSite/pkg/database/config"
)

func ConnectMySQL(cfg db.Config) {
	// dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=%s", cfg.Host, cfg.User, cfg.Password, cfg.DBName, cfg.Port, cfg.SSLMode)
}

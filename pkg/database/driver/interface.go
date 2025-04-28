package driver

import "database/sql"

type DatabaseDriver interface {
	Connect(cfg DBConfig) (*sql.DB, error)
	GetPlaceholder(index int) string
}

type DBConfig struct {
	Host     string
	Port     string
	User     string
	Password string
	DBName   string
	SSLMode  string
}

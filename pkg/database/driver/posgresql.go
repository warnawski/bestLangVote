package driver

import (
	"database/sql"
	"fmt"
)

type PostgresqlDriver struct{}

func (psql *PostgresqlDriver) Connect(cfg DBConfig) (*sql.DB, error) {
	dsn := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
		cfg.Host, cfg.Port, cfg.User, cfg.Password, cfg.DBName, cfg.SSLMode)
	return sql.Open("postgres", dsn)
}

func (psql *PostgresqlDriver) GetPlaceholder(index int) string {
	return fmt.Sprintf("$%s", index)
}

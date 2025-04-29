package driver

import (
	"database/sql"
	"fmt"
)

type PostgresqlDriver struct{}

func (psql *PostgresqlDriver) Connect(cfg DBConfig, dbType string) (*sql.DB, error) {
	dsn := fmt.Sprintf("%s:%s@%s:%s/%s?sslmode=%s",
		cfg.User, cfg.Password, cfg.Host, cfg.Port, cfg.DBName, cfg.SSLMode)
	db, err := sql.Open(dbType, dsn)
	if err != nil {
		return nil, fmt.Errorf("Ошибка", err)
	}
	return db, nil
}

func (psql *PostgresqlDriver) GetPlaceholder(index int) string {
	return fmt.Sprintf("$%s", index)
}

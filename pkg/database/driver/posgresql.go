package driver

import (
	"database/sql"
	"fmt"
)

type PostgresqlDriver struct {
	db *sql.DB
}

func (psql *PostgresqlDriver) Connect(cfg DBConfig, dbType string) error {
	dsn := fmt.Sprintf("%s:%s@%s:%s/%s?sslmode=%s",
		cfg.User, cfg.Password, cfg.Host, cfg.Port, cfg.DBName, cfg.SSLMode)

	db, err := sql.Open(dbType, dsn)
	if err != nil {
		return fmt.Errorf("Ошибка создания подключения", err)
	}

	err = db.Ping()
	if err != nil {
		return fmt.Errorf("Ошибка соединения", err)
	}
	psql.SetConfig()
	return nil
}

func (psql *PostgresqlDriver) SetConfig() {

}

func (psql *PostgresqlDriver) Close() error {
	if psql.db != nil {
		psql.db.Close()
	}
	return fmt.Errorf("Ошибка закрытия подключения")
}

package driver

import (
	"database/sql"
	"fmt"
	"time"
)

type MysqlDriver struct {
	db *sql.DB
}

func (msql *MysqlDriver) Connect(cfg DBConfig) error {
	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?parseTime=true",
		cfg.User, cfg.Password, cfg.Host, cfg.Port, cfg.DBName)

	db, err := sql.Open("mysql", dsn)
	if err != nil {
		return fmt.Errorf("Ошибка подключения", err)
	}

	err = db.Ping()
	if err != nil {
		return fmt.Errorf("Ошибка соединения", err)
	}
	msql.SetConfig()

	return nil
}

func (msql *MysqlDriver) SetConfig() {
	msql.db.SetConnMaxLifetime(time.Minute * 3)
	msql.db.SetMaxOpenConns(25)
	msql.db.SetMaxIdleConns(25)
}

func (msql *MysqlDriver) Close() error {
	if msql.db != nil {
		return msql.db.Close()
	}
	return fmt.Errorf("Ошибка закрытия")
}

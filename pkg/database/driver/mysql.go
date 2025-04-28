package driver

import (
	"database/sql"
	"fmt"
)

type MysqlDriver struct{}

func (msql *MysqlDriver) Connect(cfg DBConfig) (*sql.DB, error) {
	dsn := fmt.Sprintf("%s:%s@tsp(%s:%s)/%s?parseTime=true",
		cfg.User, cfg.Password, cfg.Host, cfg.Port, cfg.DBName)
	return sql.Open("mysql", dsn)
}

func (mysql *MysqlDriver) GetPlaceholder(index int) string {
	return "?"
}

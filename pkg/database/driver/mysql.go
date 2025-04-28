package driver

import "database/sql"

type MysqlDriver struct{}

func (msql *MysqlDriver) Connect(cfg DBConfig) (*sql.DB, error) {

}

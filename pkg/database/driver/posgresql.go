package driver

import "database/sql"

type PostgresqlDriver struct{}

func (psql *PostgresqlDriver) Connect(cfg DBConfig) (*sql.DB, error) {

}

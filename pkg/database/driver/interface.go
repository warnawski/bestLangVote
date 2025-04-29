package driver

type DBConfig struct {
	Host     string
	Port     string
	User     string
	Password string
	DBName   string
	SSLMode  string
}

type Database interface {
	Connect(cfg DBConfig) error
	SetConfig()
	Close() error
}

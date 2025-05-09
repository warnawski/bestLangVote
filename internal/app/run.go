package app

func Run() {

	db, err := dbRun()
	if err != nil {
		return
	}
	startServer(db)
}

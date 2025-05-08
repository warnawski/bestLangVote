package app

import (
	"log"
	"net/http"
	"voteSite/pkg/database/config"
	database "voteSite/pkg/database/init"
)

func startServer() error {
	router := http.NewServeMux()
	fs := http.FileServer(http.Dir("static"))
	router.Handle("/static/", http.StripPrefix("/static/", fs))

	router.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "static/style/main/index.html")
	})

	server := http.Server{
		Addr:    ":8080",
		Handler: router,
	}
	log.Println("Start Server")
	err := server.ListenAndServe()
	if err != nil {
		log.Printf("Error start server")
		return err
	}
	return nil
}

func dbRun() {
	cfg, err := config.LoadConfig("internal/config/config.yaml")
	if err != nil {
		log.Fatal("Ошибка загрузки конфигурации:", err)
	}
	db, err := database.ConnectDatabase(cfg.Database)
	if err != nil {
		log.Fatal("Ошибка подключения", err)
	}

	_ = db
}

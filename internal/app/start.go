package app

import (
	"log"
	"net/http"
	"voteSite/internal/middleware"
	serv "voteSite/internal/service"
	"voteSite/pkg/database/config"
	database "voteSite/pkg/database/init"

	"gorm.io/gorm"
)

func startServer(db *gorm.DB) error {
	router := http.NewServeMux()

	router.HandleFunc("/api/voted", func(w http.ResponseWriter, r *http.Request) {
		serv.SendVoteEnd(w, r, db)
	})

	router.HandleFunc("/api/get-count", func(w http.ResponseWriter, r *http.Request) {
		serv.GetCountVoteEnd(w, r, db)
	})

	fs := http.FileServer(http.Dir("static"))
	router.Handle("/static/", http.StripPrefix("/static/", fs))

	router.HandleFunc("/result", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "static/style/result/result.html")
		log.Print("-> result")
	})

	router.Handle("/", middleware.EnsureAnonToken(
		http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			http.ServeFile(w, r, "static/style/main/index.html")
			log.Print("-> root")
		}), db,
	))

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

func dbRun() (*gorm.DB, error) {
	cfg, err := config.LoadConfig("internal/config/config.yaml")
	if err != nil {
		log.Fatal("Ошибка загрузки конфигурации:", err)
	}
	db, err := database.ConnectDatabase(cfg.Database)
	if err != nil {
		log.Fatal("Ошибка подключения", err)
	}

	log.Print("Успешное подключение к базе данных")
	return db, nil
}

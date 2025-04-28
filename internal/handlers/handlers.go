package handlers

import (
	"fmt"
	"net/http"
)

func StartServer() error {
	fmt.Printf("Сервер запущен")
	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		return fmt.Errorf("Ошибка запуска Сервера", err)
	}
	return nil
}

func StaticContentLoader() {
	fs := http.FileServer(http.Dir("static"))
	http.Handle("/static/", http.StripPrefix("/static/", fs))
}

func MainPagePoint() {
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "static/style/main/index.html")
	})
}

func ResultPagePoint() {
	http.HandleFunc("/result", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "static/style/result/result.html")
	})
}

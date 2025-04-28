package main

import (
	"fmt"
	"net/http"

	"voteSite/internal/handlers"
)

func main() {
	defer http.ListenAndServe(":8080", nil)
	fmt.Println("Сервер запущен")

	handlers.StaticContentLoader()
	handlers.MainPagePoint()
	handlers.ResultPagePoint()
}

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

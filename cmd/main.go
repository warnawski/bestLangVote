package main

import (
	"voteSite/internal/handlers"
)

func main() {
	defer handlers.StartServer()

	handlers.StaticContentLoader()
	handlers.MainPagePoint()
	handlers.ResultPagePoint()
}

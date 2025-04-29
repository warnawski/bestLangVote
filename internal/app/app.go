package app

import (
	"voteSite/internal/handlers"
)

func Start() {
	defer handlers.StartServer()

	handlers.StaticContentLoader()
	handlers.MainPagePoint()
	handlers.ResultPagePoint()
}

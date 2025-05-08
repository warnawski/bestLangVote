package handlers

import (
	"net/http"
)

func ResultPagePoint() {
	http.HandleFunc("/result", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "static/style/result/result.html")
	})
}

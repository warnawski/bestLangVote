package handlers

import "net/http"

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

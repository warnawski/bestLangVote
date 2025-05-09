package service

import (
	"encoding/json"
	"net/http"
	"voteSite/pkg/repository/crud"

	"gorm.io/gorm"
)

type VoteJsonReq struct {
	Name string `json:"name"`
}

type VoteJsonRes struct {
	Count int `json:"count_vote"`
}

func GetCountVoteEnd(w http.ResponseWriter, r *http.Request, db *gorm.DB) {
	if r.Method != http.MethodPost {
		http.Error(w, "ТОЛЬКО POST ЗАПРОСЫ", http.StatusMethodNotAllowed)
		return
	}

	var req VoteJsonReq
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, "НЕВЕРНЫЕ ДАННЫЕ В JSON", http.StatusBadRequest)
		return
	}
	langRepo := crud.NewLangGormRepo(db)

	votes, err := langRepo.GetCountVote(req.Name)
	if err != nil {
		http.Error(w, "ОШИБКА ПОЛУЧЕНИЯ ДАННЫХ ИЗ БД", http.StatusInternalServerError)
		return
	}

	res := VoteJsonRes{Count: votes}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(res)
}

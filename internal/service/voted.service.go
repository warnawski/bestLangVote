package service

import (
	"encoding/json"
	"log"
	"net/http"
	"voteSite/pkg/repository/crud"

	"gorm.io/gorm"
)

type VotedJSONReq struct {
	Whom string `json:"whom_lang"`
}

type VotedJSONRes struct{}

func SendVoteEnd(w http.ResponseWriter, r *http.Request, db *gorm.DB) {
	if r.Method != http.MethodPost {
		http.Error(w, "ТОЛЬКО POST ЗАПРОСЫ", http.StatusMethodNotAllowed)
		return
	}

	var req VoteJsonReq
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, "НЕВЕРНЕ ДАННЫЕ В JSON", http.StatusBadRequest)
		return
	}

	cookie, err := r.Cookie("anon_token")
	if err != nil {
		http.Error(w, "ТОКЕН НЕ НАЙДЕН", http.StatusUnauthorized)
		return
	}

	token := cookie.Value

	userRepo := crud.NewUserGormRepo(db)

	voted, err := userRepo.CheckVoteStatus(token)
	if err != nil {
		http.Error(w, "Ошибка проверки статуса голосования", http.StatusInternalServerError)
		return
	}
	if voted {
		http.Error(w, "Вы уже голосовали", http.StatusForbidden)
		return
	}
	langRepo := crud.NewLangGormRepo(db)
	err = langRepo.AddVote(req.Name)
	if err != nil {
		http.Error(w, "ОШИБКА ДОБАВЛЕНИЯ ГОЛОСА", http.StatusInternalServerError)
		return
	}
	userRepo.UpdateVoteStatus(token, req.Name)
	log.Printf("Голос за %s добавлен:", req.Name)

	updateCount, err := langRepo.GetCountVote(req.Name)
	if err != nil {
		log.Printf("SendVoteEnd: Ошибка получения обновленных голосов для %s после голосования: %v", req.Name, err)
		http.Error(w, "Голос учтен, но не удалось получить обновленное количество", http.StatusInternalServerError)
		return
	}
	responsePayload := map[string]interface{}{
		"language": req.Name,
		"votes":    updateCount,
		"message":  "Голос успешно учтен!",
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	err = json.NewEncoder(w).Encode(responsePayload)
	if err != nil {
		log.Printf("SendVoteEnd: Ошибка кодирования JSON ответа: %v", err)
	}

}

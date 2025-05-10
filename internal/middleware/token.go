package middleware

import (
	"crypto/rand"
	"encoding/hex"
	"fmt"
	"net/http"
	"voteSite/pkg/repository/crud"

	"gorm.io/gorm"
)

func generateToken() (string, error) {
	b := make([]byte, 64)
	_, err := rand.Read(b)
	if err != nil {
		return "", fmt.Errorf("ошибка создания токена: %v", err)
	}
	return hex.EncodeToString(b), nil
}

func EnsureAnonToken(next http.Handler, db *gorm.DB) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		cookie, err := r.Cookie("anon_token")

		if err != nil || cookie.Value == "" {
			newToken, err := generateToken()
			if err != nil {
				http.Error(w, "не удалось создать токен", http.StatusInternalServerError)
				return
			}
			http.SetCookie(w, &http.Cookie{
				Name:  "anon_token",
				Value: newToken,
				Path:  "/",
			})
			userRepo := crud.NewUserGormRepo(db)
			userRepo.AddUser(newToken, "Not State")
		}
		next.ServeHTTP(w, r)
	})
}

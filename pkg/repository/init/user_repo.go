package repository

type UserRepo interface {
	AddUser(anom_token string, whom string) error
	CheckVoteStatus(anom_token string) (bool, error)
	UpdateVoteStatus(anom_token string) error
}

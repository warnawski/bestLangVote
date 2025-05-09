package repository

type UserRepo interface {
	AddUser(Ipv6 string, whom string) error
	CheckVoteStatus(Ipv6 string) (bool, error)
}

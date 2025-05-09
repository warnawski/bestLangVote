package repository

type LangRepo interface {
	AddVote(name string) error
	GetCountVote(name string) (int, error)
}

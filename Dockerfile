FROM golang:1.24.2-alpine AS builder

WORKDIR /app

COPY go.mod go.sum ./

RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux go build -a -ldflags="-s -w" -o /app/server ./cmd/main.go

FROM alpine:latest

WORKDIR /app

COPY --from=builder /app/server /app/server

COPY ./static ./static

COPY ./config/config.yaml ./config/config.yaml

EXPOSE 8080

CMD ["/app/server"]
package main

import (
	"learned-api/delivery/env"
	"log"
)

func main() {
	err := env.LoadEnvironmentVariables(".env")
	if err != nil {
		log.Fatal(err.Error())
		return
	}
}

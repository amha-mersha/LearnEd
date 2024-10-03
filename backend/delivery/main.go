package main

import (
	"learned-api/delivery/env"
	"learned-api/delivery/routers"
	"learned-api/infrastructure/db"
	"log"
)

func main() {
	err := env.LoadEnvironmentVariables(".env")
	if err != nil {
		log.Fatal(err.Error())
		return
	}

	mongoClient, err := db.ConnectDB(env.ENV.DB_ADDRESS, env.ENV.DB_NAME)
	if err != nil {
		log.Fatal(err.Error())
		return
	}
	database := mongoClient.Database(env.ENV.DB_NAME)

	routers.InitRouter(database, env.ENV.PORT, env.ENV.ROUTEPREFIX)
}
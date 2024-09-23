package db

import (
	"context"
	"fmt"
	"learned-api/domain"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func ConnectDB(connectionString string, databaseName string) (*mongo.Client, error) {
	if connectionString == "" {
		return nil, fmt.Errorf("error: DB connection string not found. Make sure the environment variables are set correctly")
	}

	clientOptions := options.Client().ApplyURI(connectionString)
	client, err := mongo.Connect(context.TODO(), clientOptions)
	if err != nil {
		return nil, fmt.Errorf("error: %v", err.Error())
	}

	err = client.Ping(context.TODO(), nil)
	if err != nil {
		return nil, fmt.Errorf("error: %v", err.Error())
	}

	db := client.Database(databaseName)
	err = SetupIndicies(db)
	if err != nil {
		return nil, fmt.Errorf("error: %v", err.Error())
	}

	return client, nil

}

func SetupIndicies(db *mongo.Database) error {
	_, err := db.Collection(domain.CollectionUsers).Indexes().CreateOne(context.TODO(), mongo.IndexModel{Keys: bson.D{{Key: "email", Value: 1}}, Options: options.Index().SetUnique(true)})
	if err != nil {
		return fmt.Errorf("\n\n Error " + err.Error())
	}

	return nil
}

func DisconnectDB(client *mongo.Client) {
	client.Disconnect(context.Background())
}

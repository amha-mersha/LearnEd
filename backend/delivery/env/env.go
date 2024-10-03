package env

import (
	"fmt"
	"learned-api/domain"
	"os"
	"strconv"

	"github.com/joho/godotenv"
)

var ENV domain.EnvironmentVariables

func LoadEnvironmentVariables(filename string) error {
	err := godotenv.Load(filename)
	if err != nil {
		return fmt.Errorf("error: %v", err.Error())
	}

	ENV.DB_ADDRESS = os.Getenv("DB_ADDRESS")
	ENV.DB_NAME = os.Getenv("DB_NAME")
	ENV.ROUTEPREFIX = os.Getenv("ROUTEPREFIX")
	ENV.JWT_SECRET = os.Getenv("JWT_SECRET")

	port, err := strconv.ParseInt(os.Getenv("PORT"), 10, 64)
	if err != nil {
		return fmt.Errorf("error parsing PORT number: %v", err.Error())
	}

	ENV.PORT = int(port)
	switch {
	case ENV.DB_ADDRESS == "":
		return fmt.Errorf("error: couldn't load environment variable 'DB_ADDRESS'")
	case ENV.DB_NAME == "":
		return fmt.Errorf("error: couldn't load environment variable 'DB_NAME'")
	case ENV.ROUTEPREFIX == "":
		return fmt.Errorf("error: couldn't load environment variable 'ROUTEPREFIX'")
	case ENV.JWT_SECRET == "":
		return fmt.Errorf("error: couldn't load environment variable 'JWT_SECRET'")
	default:
		return nil
	}
}

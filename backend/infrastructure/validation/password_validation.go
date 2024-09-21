package validation

import (
	"learned-api/domain"
	"strings"
)

func ValidatePassword(password string) domain.CodedError {
	if len(password) < 8 {
		return domain.NewError("Password too short", domain.ERR_BAD_REQUEST)
	}

	if len(password) > 71 {
		return domain.NewError("Password too long", domain.ERR_BAD_REQUEST)
	}

	if !strings.ContainsAny(password, "abcdefghijklmnopqrstuvwxyz") {
		return domain.NewError("Password must contain a lower case letter", domain.ERR_BAD_REQUEST)
	}

	if !strings.ContainsAny(password, "ABCDEFGHIJKLMNOPQRSTUVWXYZ") {
		return domain.NewError("Password must contain an upper case letter", domain.ERR_BAD_REQUEST)
	}

	if !strings.ContainsAny(password, "0123456789") {
		return domain.NewError("Password must contain a number", domain.ERR_BAD_REQUEST)
	}

	if !strings.ContainsAny(password, "!@#$%^&*()_+-=[]{}|;:,.<>?/\\") {
		return domain.NewError("Password must contain a special character", domain.ERR_BAD_REQUEST)
	}

	return nil
}

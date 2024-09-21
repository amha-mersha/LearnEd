package validation

import (
	"learned-api/domain"
	"net/mail"
)

func EmailValidation(email string) domain.CodedError {
	if _, err := mail.ParseAddress(email); err != nil {
		return domain.NewError("Invalid Email", domain.ERR_BAD_REQUEST)
	}

	return nil
}

package validation

import "learned-api/domain"

func ValidateName(name string) domain.CodedError {
	if len(name) < 2 {
		return domain.NewError("Name too short", domain.ERR_BAD_REQUEST)
	}

	if len(name) > 20 {
		return domain.NewError("Name too long", domain.ERR_BAD_REQUEST)
	}

	return nil
}

package validation_services

import (
	"learned-api/domain"
	"net/mail"
	"strings"
)

type AuthValidation struct{}

func NewAuthValidation() *AuthValidation {
	return &AuthValidation{}
}

func (v *AuthValidation) ValidateName(name string) domain.CodedError {
	if len(name) < 2 {
		return domain.NewError("Name too short", domain.ERR_BAD_REQUEST)
	}

	if len(name) > 20 {
		return domain.NewError("Name too long", domain.ERR_BAD_REQUEST)
	}

	return nil
}

func (v *AuthValidation) ValidateEmail(email string) domain.CodedError {
	if _, err := mail.ParseAddress(email); err != nil {
		return domain.NewError("Invalid Email", domain.ERR_BAD_REQUEST)
	}

	return nil
}

func (v *AuthValidation) ValidatePassword(password string) domain.CodedError {
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

func (v *AuthValidation) ValidateType(userType string) domain.CodedError {
	if userType != domain.RoleTeacher && userType != domain.RoleStudent {
		return domain.NewError("Invalid user type", domain.ERR_BAD_REQUEST)
	}

	return nil
}

func (v *AuthValidation) ValidateUser(user domain.User) domain.CodedError {
	if err := v.ValidateName(user.Name); err != nil {
		return err
	}

	if err := v.ValidateEmail(user.Email); err != nil {
		return err
	}

	if err := v.ValidatePassword(user.Password); err != nil {
		return err
	}

	if err := v.ValidateType(user.Type); err != nil {
		return err
	}

	return nil
}

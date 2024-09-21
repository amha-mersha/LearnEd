package domain

type AuthValidation interface {
	ValidateName(name string) CodedError
	ValidatieEmail(email string) CodedError
	ValidatePassword(password string) CodedError
}

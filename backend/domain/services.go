package domain

type HashingServiceInterface interface {
	HashString(password string) (string, CodedError)
	ValidateHashedString(hashedString string, plaintextString string) CodedError
}

type AuthValidation interface {
	ValidateName(name string) CodedError
	ValidatieEmail(email string) CodedError
	ValidatePassword(password string) CodedError
	ValidateType(userType string) CodedError
	ValidateUser(user User) CodedError
}

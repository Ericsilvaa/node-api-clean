const validator = require("validator");
const EmailValidator = require("./email-validator");

// factory
const makeSut = () => {
  return new EmailValidator();
};

describe("Email Validator", () => {
  test("should return true if validator returns true", () => {
    const sut = makeSut();
    const isEmailValid = sut.isValid("valid_email@.com");

    expect(isEmailValid).toBe(true);
  });

  test("should return false if validator returns false", () => {
    validator.isEmailValid = false;
    const sut = makeSut();
    const isEmailValid = sut.isValid("valid_email");

    expect(isEmailValid).toBe(false);
  });

  test("should call with correct email", () => {
    const sut = makeSut();
    sut.isValid("valid_email");

    expect(validator.email).toBe("valid_email");
  });
});

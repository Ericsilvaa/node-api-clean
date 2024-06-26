const { InvalidParamError, MissingParamError } = require("../../utils/errors");
const { ServerError, UnauthorizedError } = require("../errors");

const LoginRouter = require("./login-router");

// factory
const makeSut = () => {
  const authUseCaseSpy = makeAuthUseCase();
  authUseCaseSpy.accessToken = "default_valid_token";
  const emailValidatorSpy = makeEmailValidator();
  const sut = new LoginRouter(authUseCaseSpy, emailValidatorSpy);
  return {
    sut,
    authUseCaseSpy,
    emailValidatorSpy,
  };
};

const makeEmailValidator = () => {
  class EmailValidatorSpy {
    isValid(email) {
      this.email = email;
      return this.isEmailValid;
    }
  }

  const emailValidatorSpy = new EmailValidatorSpy();
  emailValidatorSpy.isEmailValid = true;
  return emailValidatorSpy;
};

const makeAuthUseCase = () => {
  class AuthUseCaseSpy {
    // spy = class de test que utilizada para capturar e valores e utilziar.
    async auth(email, password) {
      this.password = password;
      this.email = email;

      return this.accessToken;
    }
  }
  return new AuthUseCaseSpy();
};

const makeAuthUseCaseWithError = () => {
  class AuthUseCaseSpy {
    auth() {
      throw new Error();
    }
  }
  return new AuthUseCaseSpy();
};

const makeEmailValidatorWithError = () => {
  class EmailValidatorSpy {
    isValid() {
      throw new Error();
    }
  }
  return new EmailValidatorSpy();
};

describe("Login Router", () => {
  test("should return status 500 if no httpRequest is provided", async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.route();

    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });

  test("should return status 500 if no httpRequest has no body", async () => {
    const { sut } = makeSut();

    const httpRequest = {};

    const httpResponse = await sut.route(httpRequest);

    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });

  test("should return status 400 if no password is provided", async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: "eric@dev.com",
      },
    };

    const httpResponse = await sut.route(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    // comparation the values between the objects
    expect(httpResponse.body).toEqual(new MissingParamError("password"));
  });

  test("should return status 400 if no email is provided", async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        password: "123_password",
      },
    };

    const httpResponse = await sut.route(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    // comparation the values between the objects
    expect(httpResponse.body).toEqual(new MissingParamError("email"));
  });

  test("should return status 400 if an invalid email is provided", async () => {
    const { sut, emailValidatorSpy } = makeSut();
    emailValidatorSpy.isEmailValid = false;

    const httpRequest = {
      body: {
        email: "invalid_@.com",
        password: "123_password",
      },
    };

    const httpResponse = await sut.route(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    // comparation the values between the objects
    expect(httpResponse.body).toEqual(new InvalidParamError("email"));
  });

  test("Should call AuthUseCase with correct params", async () => {
    const { sut, authUseCaseSpy } = makeSut();
    const httpRequest = {
      body: {
        email: "eric@email.com",
        password: "123_password",
      },
    };

    await sut.route(httpRequest);

    expect(authUseCaseSpy.email).toBe(httpRequest.body.email);
    expect(authUseCaseSpy.password).toBe(httpRequest.body.password);
  });

  test("Should return 401 when invalid credentials are provided ", async () => {
    const { sut, authUseCaseSpy } = makeSut();
    authUseCaseSpy.accessToken = null;
    const httpRequest = {
      body: {
        email: "invalid@email.com",
        password: "invalid_password",
      },
    };

    const httpResponse = await sut.route(httpRequest);

    expect(httpResponse.statusCode).toBe(401);
    expect(httpResponse.body).toEqual(new UnauthorizedError());
  });

  test("Should return 200 when valid credentials are provided ", async () => {
    const { sut, authUseCaseSpy } = makeSut();

    const httpRequest = {
      body: {
        email: "valid@email.com",
        password: "valid_password",
      },
    };

    const { statusCode, body } = await sut.route(httpRequest);

    expect(statusCode).toBe(200);
    expect(body.accessToken).toEqual(authUseCaseSpy.accessToken);
  });

  test("should return status 500 if no AuthUseCase is provided", async () => {
    const sut = new LoginRouter();

    const httpRequest = {
      body: {
        email: "any_email",
        password: "any_password",
      },
    };

    const httpResponse = await sut.route(httpRequest);

    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });

  test("should return status 500 if no AuthUseCase has no auth", async () => {
    // class AuthUseCaseSpy {}
    // const authUseCaseSpy = new AuthUseCaseSpy();
    // const sut = new LoginRouter(authUseCaseSpy); or //
    const sut = new LoginRouter({});

    const httpRequest = {
      body: {
        email: "any_email",
        password: "any_password",
      },
    };

    const httpResponse = await sut.route(httpRequest);

    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });

  test("should return status 500 if AuthUseCase throws", async () => {
    const authUseCaseSpy = makeAuthUseCaseWithError();
    const sut = new LoginRouter(authUseCaseSpy);

    const httpRequest = {
      body: {
        email: "any_email",
        password: "any_password",
      },
    };

    const httpResponse = await sut.route(httpRequest);

    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });

  test("Should call EmailValidator with correct email", async () => {
    const { sut, emailValidatorSpy } = makeSut();

    const httpRequest = {
      body: {
        email: "eric@email.com",
        password: "123_password",
      },
    };

    await sut.route(httpRequest);

    expect(emailValidatorSpy.email).toBe(httpRequest.body.email);
  });

  test("should return status 500 if no EmailValidator is provided", async () => {
    const authUseCaseSpy = makeAuthUseCase();
    const sut = new LoginRouter(authUseCaseSpy);

    const httpRequest = {
      body: {
        email: "any_email",
        password: "any_password",
      },
    };

    const httpResponse = await sut.route(httpRequest);

    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });

  test("should return status 500 if EmailValidator has no isValid method", async () => {
    const authUseCaseSpy = makeAuthUseCase();
    const sut = new LoginRouter(authUseCaseSpy, {});

    const httpRequest = {
      body: {
        email: "invalid@.com",
        password: "any_password",
      },
    };

    const httpResponse = await sut.route(httpRequest);

    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });

  test("should return status 500 if EmailValidator throws", async () => {
    const authUseCaseSpy = makeAuthUseCase();
    const emailValidatorSpy = makeEmailValidatorWithError();
    const sut = new LoginRouter(authUseCaseSpy, emailValidatorSpy);

    const httpRequest = {
      body: {
        email: "invalid@.com",
        password: "any_password",
      },
    };

    const httpResponse = await sut.route(httpRequest);

    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });
});

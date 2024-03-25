const LoginRouter = require("./login-router");
const MissingParamError = require("../helpers/missing-param-error");
const UnauthorizedError = require("../helpers/unauthorized-error");

// factory
const makeSut = () => {
  // spy = class de test que utilizada para capturar e valores e utilziar.
  class AuthUseCaseSpy {
    auth(email, password) {
      this.password = password;
      this.email = email;
    }
  }
  const authUseCaseSpy = new AuthUseCaseSpy();
  const sut = new LoginRouter(authUseCaseSpy);
  return {
    sut,
    authUseCaseSpy,
  };
};

describe("Login Router", () => {
  test("should return status 500 if no httpRequest is provided", () => {
    const { sut } = makeSut();

    const httpResponse = sut.route();

    expect(httpResponse.statusCode).toBe(500);
  });

  test("should return status 500 if no httpRequest has no body", () => {
    const { sut } = makeSut();

    const httpRequest = {};

    const httpResponse = sut.route(httpRequest);

    expect(httpResponse.statusCode).toBe(500);
  });

  test("should return status 400 if no email is provided", () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        password: "123_password",
      },
    };

    const httpResponse = sut.route(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    // comparation the values between the objects
    expect(httpResponse.body).toEqual(new MissingParamError("email"));
  });
  test("should return status 400 if no password is provided", () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: "eric@dev.com",
      },
    };

    const httpResponse = sut.route(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    // comparation the values between the objects
    expect(httpResponse.body).toEqual(new MissingParamError("password"));
  });

  test("Should call AuthUseCase with correct params", () => {
    const { sut, authUseCaseSpy } = makeSut();
    const httpRequest = {
      body: {
        email: "eric@email.com",
        password: "123_password",
      },
    };

    sut.route(httpRequest);

    expect(authUseCaseSpy.email).toBe(httpRequest.body.email);
    expect(authUseCaseSpy.password).toBe(httpRequest.body.password);
  });

  test("Should return 401 when invalid credentials are provided ", () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: "invalid@email.com",
        password: "invalid_password",
      },
    };

    const httpResponse = sut.route(httpRequest);

    expect(httpResponse.statusCode).toBe(401);
    expect(httpResponse.body).toEqual(new UnauthorizedError());
  });

  test("should return status 500 if no AuthUseCase is provided", () => {
    const sut = new LoginRouter();

    const httpRequest = {
      body: {
        email: "any_email",
        password: "any_password",
      },
    };

    const httpResponse = sut.route(httpRequest);

    expect(httpResponse.statusCode).toBe(500);
  });
  test("should return status 500 if no AuthUseCase has no auth", () => {
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

    const httpResponse = sut.route(httpRequest);

    expect(httpResponse.statusCode).toBe(500);
  });
});

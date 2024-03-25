const { MissingParamError, InvalidParamError } = require("../errors");
const HttpResponse = require("../helpers/http-response");

class LoginRouter {
  constructor(authUseCase, emailValidator) {
    this.authUseCase = authUseCase;
    this.emailValidator = emailValidator;
  }

  async route(httpRequest) {
    try {
      // remove the commented code to catch the error
      // if (
      //   !httpRequest ||
      //   !httpRequest.body ||
      //   !this.authUseCase ||
      //   !this.authUseCase.auth
      // ) {
      //   return HttpResponse.serverError();
      // }

      const { email, password } = httpRequest.body;

      if (!email) {
        return HttpResponse.badRequest(new MissingParamError("email"));
      }

      if (!password) {
        return HttpResponse.badRequest(new MissingParamError("password"));
      }

      if (!this.emailValidator.isValid(email)) {
        return HttpResponse.badRequest(new InvalidParamError("email"));
      }

      const accessToken = await this.authUseCase.auth(email, password);
      if (!accessToken) return HttpResponse.unauthorizedError();

      return HttpResponse.ok({ accessToken });
    } catch (error) {
      // console.error(error);
      return HttpResponse.serverError();
    }
  }
}

module.exports = LoginRouter;

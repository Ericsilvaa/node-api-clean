const HttpResponse = require("../helpers/http-response");
const MissingParamError = require("../helpers/missing-param-error");

class LoginRouter {
  constructor(authUseCase) {
    this.authUseCase = authUseCase;
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

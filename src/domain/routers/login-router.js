const HttpResponse = require("../helpers/http-response");

class LoginRouter {
  constructor(authUseCase) {
    this.authUseCase = authUseCase;
  }

  route(httpRequest) {
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
        return HttpResponse.badRequest("email");
      }
      if (!password) {
        return HttpResponse.badRequest("password");
      }

      const accessToken = this.authUseCase.auth(email, password);
      if (!accessToken) return HttpResponse.unauthorizedError();

      return HttpResponse.ok({ accessToken });
    } catch (error) {
      // console.error(error);
      return HttpResponse.serverError();
    }
  }
}

module.exports = LoginRouter;

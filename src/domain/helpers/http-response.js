const MissingParamError = require("./missing-param-error");
const ServerError = require("./server-error");
const UnauthorizedError = require("./unauthorized-error");

class HttpResponse {
  static badRequest(paramName) {
    return {
      statusCode: 400,
      body: new MissingParamError(paramName),
    };
  }
  static serverError() {
    return {
      statusCode: 500,
      body: new ServerError(),
    };
  }
  static ok(data) {
    return {
      statusCode: 200,
      body: data,
    };
  }

  static unauthorizedError() {
    return {
      statusCode: 401,
      body: new UnauthorizedError(),
    };
  }
}

module.exports = HttpResponse;

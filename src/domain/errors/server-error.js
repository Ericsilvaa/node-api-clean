class ServerError extends Error {
  constructor(paramName) {
    super(`Internal Error`);
    this.name = "UnauthorizedError";
  }
}

module.exports = ServerError;

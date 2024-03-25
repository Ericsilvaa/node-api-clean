class UnauthorizedError extends Error {
  constructor(paramName) {
    super(`Unauthorized`);
    this.name = "UnauthorizedError";
  }
}

module.exports = UnauthorizedError;

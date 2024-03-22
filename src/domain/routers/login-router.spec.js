class LoginRouter {
  route(httpRequest) {}
}

describe("Login Router", () => {
  test("should return status 400 if no email is provided", () => {
    const sut = new LoginRouter();
    const httpRequest = {
      body: {
        password: "123_password",
      },
    };

    const httpResponse = sut.route(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
  });
});

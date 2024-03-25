/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

/** @type {import('jest').Config} */
const config = {
  coverageDirectory: "coverage",
  testEnvironment: "node",
  coverageProvider: "v8",
  collectCoverageFrom: ["**/src/**/*.js"],
};

module.exports = config;

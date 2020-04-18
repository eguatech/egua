module.exports.RuntimeError = class RuntimeError extends Error {
  constructor(token, message) {
    super(message);
    this.token = token;
  }
};

module.exports.ContinueException = class ContinueException extends Error { };

module.exports.BreakException = class BreakException extends Error { };

module.exports.ReturnException = class ReturnException extends Error {
  constructor(value) {
    super(value);
    this.value = value;
  }
};
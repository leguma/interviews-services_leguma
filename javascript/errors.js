// A custom error we'll use in our middleware for easily handling exceptions
class RestError extends Error {
  constructor(data) {
    super(data.message);
    this.status = data.status;
    this.body = data.body;
  }
}

exports.RestError = RestError;

class GeneralError extends Error {
  constructor(message) {
    super(message)
  }

  getErrorCode() {
    if (this instanceof UnauthorizedError) {
      return 401
    }

    if (this instanceof NotFoundError) {
      return 404
    }

    return 500
  }

  getErrorMessage() {
    return this.message
  }
}

class UnauthorizedError extends GeneralError {}
class NotFoundError extends GeneralError {}

export {GeneralError, UnauthorizedError, NotFoundError}

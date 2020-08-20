import {GeneralError} from './error'

function errorMiddleware(err, req, res, next) {
  if (err instanceof GeneralError) {
    const errorMessage = err.getErrorMessage()
    const errorCode = err.getErrorCode()
    return res.status(errorCode).json({
      status: 'error',
      code: errorCode,
      message: errorMessage,
    })
  }

  return res.status(500).json({
    status: 'error',
    code: 500,
    message: err.message,
  })
}

export default errorMiddleware

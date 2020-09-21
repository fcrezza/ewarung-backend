import {validationResult} from 'express-validator'

import {BadRequestError} from './error'

const customValidationResult = validationResult.withDefaults({
  formatter: (error) => ({name: error.param, message: error.msg})
})

const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map((validation) => validation.run(req)))

    const errors = customValidationResult(req)
    if (errors.isEmpty()) {
      return next()
    }

    throw new BadRequestError(errors.array())
  }
}

export default validate

import { CUSTOM_VALIDATION } from '@src/models/index'
import { Response } from 'express'
import { Error as MongooseError } from 'mongoose'

interface HandlerErrorResponse {
  code: number
  error: string
}

export abstract class BaseController {
  protected sendCreatedUpdateErrorResponse(
    res: Response,
    error: unknown
  ): Response {
    if (error instanceof MongooseError.ValidationError) {
      const { code: statusCode, error: ClientError } =
        this.handleClientErrors(error)

      return res
        .status(statusCode)
        .send({ code: statusCode, error: ClientError })
    } else {
      return res.status(500).send({ code: 500, error: 'Internal Server Error' })
    }
  }

  private handleClientErrors(
    error: MongooseError.ValidationError
  ): HandlerErrorResponse {
    const duplicatedKindErrors = Object.values(error.errors).filter(
      (err) => err.kind === CUSTOM_VALIDATION.DUPLICATED
    )

    if (duplicatedKindErrors.length) {
      return { code: 409, error: error.message }
    }

    return { code: 422, error: error.message }
  }
}

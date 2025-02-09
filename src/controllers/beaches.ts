import { ClassMiddleware, Controller, Post } from '@overnightjs/core'
import { authMiddleware } from '@src/middlewares/auth'
import { Beach } from '@src/models/beach'
import { Request, Response } from 'express'
import mongoose from 'mongoose'

@Controller('beaches')
@ClassMiddleware(authMiddleware)
export class BeachController {
  @Post('')
  public async getBeachForgeLoggedUser(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const beach = new Beach({ ...req.body, ...{ user: req.decoded?.id } })
      const result = await beach.save()

      res.status(201).send(result.toJSON())
    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(422).send({ error: error.message })
      } else {
        res.status(500).send({ error: 'Internal Server Error' })
      }
    }
  }
}

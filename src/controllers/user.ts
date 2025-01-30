import { Controller, Post } from '@overnightjs/core'
import { User } from '@src/models/user'
import { Request, Response } from 'express'
import mongoose from 'mongoose'

@Controller('user')
export class UserController {
  @Post('')
  public async getUsersForgeLoggedUser(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const user = new User(req.body)
      const newUser = await user.save()
      res.status(201).send(newUser)
    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(422).send({ error: error.message })
      } else {
        res.status(500).send({ error: 'Internal Server Error' })
      }
    }
  }
}

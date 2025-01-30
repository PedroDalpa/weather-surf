import { Controller, Post } from '@overnightjs/core'
import { User } from '@src/models/user'
import { Request, Response } from 'express'
import { BaseController } from '.'
// import mongoose from 'mongoose'

@Controller('user')
export class UserController extends BaseController {
  @Post('')
  public async getUsersForgeLoggedUser(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const user = new User(req.body)
      const newUser = await user.save()
      res.status(201).send(newUser)
    } catch (error: unknown) {
      this.sendCreatedUpdateErrorResponse(res, error)
    }
  }
}

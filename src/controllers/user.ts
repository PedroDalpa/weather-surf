import { Controller, Post } from '@overnightjs/core'
import { User } from '@src/models/user'
import { Request, Response } from 'express'
import { BaseController } from '.'
import AuthService from '@src/services/auth'
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

  @Post('auth')
  public async auth(req: Request, res: Response): Promise<Response> {
    const { password, email } = req.body
    const user = await User.findOne({
      email,
    })

    if (!user || !user?.password) {
      return res.status(400).send({ error: 'Email or password wrong!' })
    }

    const passwordIsValid = await AuthService.comparePassword(
      password,
      user?.password
    )

    if (passwordIsValid) {
      const token = AuthService.generateToken(user.toJSON())
      return res.status(200).send({ token })
    }

    return res.status(400).send({ error: 'Email or password wrong!' })
  }
}

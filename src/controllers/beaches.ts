import { Controller, Post } from '@overnightjs/core'
import { Request, Response } from 'express'

@Controller('beaches')
export class BeachController {
  @Post('')
  public async getBeachForgeLoggedUser(
    req: Request,
    res: Response
  ): Promise<void> {
    const editedBody = { ...req.body, id: 'fake-id' }

    res.status(201).send(editedBody)
  }
}

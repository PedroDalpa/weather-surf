import { ClassMiddleware, Controller, Get } from '@overnightjs/core'
import { authMiddleware } from '@src/middlewares/auth'
import { Beach } from '@src/models/beach'
import { ForecastService } from '@src/services/forecast'
import { Request, Response } from 'express'

const forecast = new ForecastService()
@Controller('forecast')
@ClassMiddleware(authMiddleware)
export class ForecastController {
  @Get('')
  public async getForecastForgeLoggedUser(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const beaches = await Beach.find({ user: req.decoded?.id })

      const forecastData = await forecast.processForecastForBeaches(beaches)

      res.status(200).send(forecastData)
    } catch (_) {
      res.status(500).send({ err: 'Something went wrong' })
    }
  }
}

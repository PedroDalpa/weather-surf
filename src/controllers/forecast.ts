import { Controller, Get } from '@overnightjs/core'
import { Beach } from '@src/models/beach'
import { ForecastService } from '@src/services/forecast'
import { Request, Response } from 'express'

const forecast = new ForecastService()
@Controller('forecast')
export class ForecastController {
  @Get('')
  public async getForecastForgeLoggedUser(
    _: Request,
    res: Response
  ): Promise<void> {
    try {
      const beaches = await Beach.find({})

      const forecastData = await forecast.processForecastForBeaches(beaches)

      res.status(200).send(forecastData)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      res.status(500).send({ err: 'Something went wrong' })
    }
  }
}

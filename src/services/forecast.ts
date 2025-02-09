import { ForecastPoint, StormGlass } from '@src/clients/stormGlass'
import { Beach } from '@src/models/beach'
import { InternalError } from '@src/utils/errors/internal-error'

interface BeachForecast extends Omit<Beach, 'user'>, ForecastPoint {}

interface TimeForecast {
  time: string
  forecast: BeachForecast[]
}

export class ForecastProcessingInternalError extends InternalError {
  constructor(message: string) {
    super(`Unexpected error during the forecast processing: ${message}`)
  }
}
export class ForecastService {
  constructor(protected stormGlass = new StormGlass()) {}

  public async processForecastForBeaches(
    beaches: Beach[]
  ): Promise<TimeForecast[]> {
    const pointsWithCorrectSources: BeachForecast[] = []
    try {
      for (const beach of beaches) {
        const points = await this.stormGlass.fetchPoints(beach.lat, beach.lng)

        const enrichedBeachData = this.enrichBeachData(points, beach)
        pointsWithCorrectSources.push(...enrichedBeachData)
      }

      return this.mapForecastByTime(pointsWithCorrectSources)
    } catch (err) {
      throw new ForecastProcessingInternalError(err as string)
    }
  }

  private enrichBeachData(
    points: ForecastPoint[],
    beach: Beach
  ): BeachForecast[] {
    const enrichedBeachData = points.map((e) => ({
      ...{
        lat: beach.lat,
        lng: beach.lng,
        name: beach.name,
        position: beach.position,
        rating: 1,
      },
      ...e,
    }))

    return enrichedBeachData
  }

  private mapForecastByTime(forecast: BeachForecast[]): TimeForecast[] {
    const forecastByTime: TimeForecast[] = []
    for (const point of forecast) {
      const timePoint = forecastByTime.find((f) => f.time === point.time)
      if (timePoint) {
        timePoint.forecast.push(point)
      } else {
        forecastByTime.push({
          time: point.time,
          forecast: [point],
        })
      }
    }
    return forecastByTime
  }
}

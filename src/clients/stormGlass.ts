import { InternalError } from '@src/utils/errors/internal-error'
import { AxiosStatic } from 'axios'

export interface StormGlassPointSource {
  [key: string]: number
}

export interface StormGlassPoint {
  readonly time: string
  readonly waveHeight: StormGlassPointSource
  readonly waveDirection: StormGlassPointSource
  readonly swellHeight: StormGlassPointSource
  readonly swellDirection: StormGlassPointSource
  readonly swellPeriod: StormGlassPointSource
  readonly windSpeed: StormGlassPointSource
  readonly windDirection: StormGlassPointSource
}

export interface StormGlassForecastResponse {
  hours: StormGlassPoint[]
}

export interface ForecastPoint {
  time: string
  waveHeight: number
  waveDirection: number
  swellHeight: number
  swellDirection: number
  swellPeriod: number
  windSpeed: number
  windDirection: number
}

interface StormGlassError {
  response: any
}

export class ClientRequestError extends InternalError {
  constructor(message: string) {
    const internalMessage =
      'Unexpected error when trying to communicate to StormGlass'
    super(`${internalMessage}: ${message}`)
  }
}

export class StormGlassResponseError extends InternalError {
  constructor(message: string) {
    const internalMessage =
      'Unexpected error returned by the StormGlass service'
    super(`${internalMessage}: ${message}`)
  }
}

export class StormGlass {
  readonly stormGlassAPIParams =
    'swellDirection,swellHeight,swellPeriod,waveDirection,waveHeight,windDirection,windSpeed'
  readonly stormGlassAPISource = 'noaa'
  constructor(protected req: AxiosStatic) {}

  public async fetchPoints(lat: number, lng: number): Promise<ForecastPoint[]> {
    try {
      const response = await this.req.get(
        'https://api.stormglass.io/v2/weather/point?' +
          `lat=${lat}&lng=${lng}&params=${this.stormGlassAPIParams}` +
          `&source=${this.stormGlassAPISource}`
      )

      return this.normalizeResponse(response.data)
    } catch (err) {
      if (
        (err as StormGlassError).response &&
        (err as StormGlassError).response.status
      ) {
        throw new StormGlassResponseError(
          `Error: ${JSON.stringify((err as StormGlassError).response.data)} Code: ${
            (err as StormGlassError).response.status
          }`
        )
      }
      throw new ClientRequestError((err as Error).message)
    }
  }

  private normalizeResponse(
    points: StormGlassForecastResponse
  ): ForecastPoint[] {
    return points.hours.filter(this.isValidPoint.bind(this)).map((point) => ({
      time: point.time,
      waveHeight: point.waveHeight[this.stormGlassAPISource],
      waveDirection: point.waveDirection[this.stormGlassAPISource],
      swellHeight: point.swellHeight[this.stormGlassAPISource],
      swellDirection: point.swellDirection[this.stormGlassAPISource],
      swellPeriod: point.swellPeriod[this.stormGlassAPISource],
      windSpeed: point.windSpeed[this.stormGlassAPISource],
      windDirection: point.windDirection[this.stormGlassAPISource],
    }))
  }

  private isValidPoint(point: Partial<StormGlassPoint>): boolean {
    return !!(
      point.time &&
      point.swellDirection?.[this.stormGlassAPISource] &&
      point.swellHeight?.[this.stormGlassAPISource] &&
      point.swellPeriod?.[this.stormGlassAPISource] &&
      point.waveDirection?.[this.stormGlassAPISource] &&
      point.waveHeight?.[this.stormGlassAPISource] &&
      point.windDirection?.[this.stormGlassAPISource] &&
      point.windSpeed?.[this.stormGlassAPISource]
    )
  }
}

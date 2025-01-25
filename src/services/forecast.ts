import { ForecastPoint, StormGlass } from '@src/clients/stormGlass'

export enum BeachPosition {
  S = 'S',
  E = 'E',
  N = 'N',
  W = 'W',
}

export interface Beach {
  lat: number
  lng: number
  name: string
  user: string
  position: BeachPosition
}

interface BeachForecast extends Omit<Beach, 'user'>, ForecastPoint {}

export class ForecastService {
  constructor(protected stormGlass = new StormGlass()) {}

  public async processForecastForBeaches(
    beaches: Beach[]
  ): Promise<BeachForecast[]> {
    const pointsWithCorrectSources: BeachForecast[] = []
    for (const beach of beaches) {
      const points = await this.stormGlass.fetchPoints(beach.lat, beach.lng)
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

      pointsWithCorrectSources.push(...enrichedBeachData)
    }

    return pointsWithCorrectSources
  }
}

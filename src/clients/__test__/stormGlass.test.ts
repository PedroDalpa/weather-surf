import axios from 'axios'
import { StormGlass } from '../stormGlass'
import stormGlassWeather3HoursFixture from '@test/fixtures/stormglass_weather_3_hours.json'
import stormGlassNormalizeResponse3HoursFixture from '@test/fixtures/stormglass_normalize_response_3_hours.json'

jest.mock('axios')

describe('StormGlass client', () => {
  const mockedAxios = axios as jest.Mocked<typeof axios>
  it('should return normalized forecast from the StormGlass service', async () => {
    const lat = -33.792726
    const lng = 151.289824

    mockedAxios.get.mockResolvedValue({ data: stormGlassWeather3HoursFixture })

    const stormGlass = new StormGlass(axios)
    const response = await stormGlass.fetchPoints(lat, lng)

    expect(response).toEqual(stormGlassNormalizeResponse3HoursFixture)
  })
})

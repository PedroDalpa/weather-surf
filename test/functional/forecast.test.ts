import { Beach, BeachPosition } from '@src/models/beach'
import nock from 'nock'
import stormGlassWeather3HoursFixture from '@test/fixtures/stormglass_weather_3_hours.json'
import forecastResponseOneBeach from '@test/fixtures/api_forecast_response_one_beach.json'
import { User } from '@src/models/user'
import AuthService from '@src/services/auth'

let token: string
const defaultUser = {
  email: 'john@gmail.com',
  password: '12334',
  name: 'john',
}

describe('Beach forecast functional tests', () => {
  beforeAll(async () => {
    await Beach.deleteMany({})
    await User.deleteMany({})

    const user = await new User(defaultUser).save()

    const defaultBeach = {
      lat: -33.792726,
      lng: 151.289824,
      name: 'Manly',
      position: BeachPosition.E,
      user: user.id,
    }
    await new Beach(defaultBeach).save()

    const anotherUser = await new User({
      ...defaultUser,
      email: 'another@gmai.com',
    }).save()
    const anotherBeach = {
      lat: -33.792726,
      lng: 151.289824,
      name: 'Teste',
      position: BeachPosition.E,
      user: anotherUser.id,
    }
    await new Beach(anotherBeach).save()

    token = AuthService.generateToken(user.toJSON())
  })

  it('should return a forecast with just a few times', async () => {
    nock('https://api.stormglass.io:443', {
      encodedQueryParams: true,
      reqheaders: {
        Authorization: (): boolean => true,
      },
    })
      .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
      .get('/v2/weather/point')
      .query({
        lat: '-33.792726',
        lng: '151.289824',
        params: /(.*)/,
        source: 'noaa',
      })
      .reply(200, stormGlassWeather3HoursFixture)

    const { body, status } = await global.testRequest
      .get('/forecast')
      .set('x-access-token', token)
    expect(status).toBe(200)
    expect(body).toEqual(forecastResponseOneBeach)
  })

  it('should return 500 if something goes wrong during the processing', async () => {
    nock('https://api.stormglass.io:443', {
      encodedQueryParams: true,
      reqheaders: {
        Authorization: (): boolean => true,
      },
    })
      .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
      .get('/v2/weather/point')
      .query({
        lat: '-33.792726',
        lng: '151.289824',
        source: 'noaa',
      })
      .replyWithError({ error: 'Internal Server Error' })

    const { status } = await global.testRequest
      .get('/forecast')
      .set('x-access-token', token)

    expect(status).toBe(500)
  })
})

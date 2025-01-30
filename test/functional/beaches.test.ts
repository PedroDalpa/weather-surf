import { Beach } from '@src/models/beach'
import { User } from '@src/models/user'
import AuthService from '@src/services/auth'

let token: string
describe('Beaches functional tests', () => {
  beforeAll(async () => {
    await Beach.deleteMany({})
    await User.deleteMany({})
    const defaultUser = {
      email: 'john@gmail.com',
      name: 'john',
      password: 'test',
    }
    const user = await new User(defaultUser).save()

    token = AuthService.generateToken(user.toJSON())
  })
  describe('When creating a beach', () => {
    it('should create a beach with success', async () => {
      const newBeach = {
        lat: -33.792726,
        lng: 151.289824,
        name: 'Manly',
        position: 'E',
      }

      const response = await global.testRequest
        .post('/beaches')
        .set('x-access-token', token)
        .send(newBeach)

      expect(response.status).toBe(201)
      expect(response.body).toMatchObject(newBeach)
    })

    it('should return 422 when there is a validation error', async () => {
      const newBeach = {
        lat: 'invalid_string',
        lng: 151.289824,
        name: 'Manly',
        position: 'E',
      }

      const response = await global.testRequest
        .post('/beaches')
        .set('x-access-token', token)
        .send(newBeach)

      expect(response.status).toBe(422)
      expect(response.body).toEqual({
        error:
          'Beach validation failed: lat: Cast to Number failed for value "invalid_string" (type string) at path "lat"',
      })
    })
  })
})

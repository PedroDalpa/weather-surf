import { User } from '@src/models/user'

describe('Users functional tests', () => {
  beforeAll(async () => {
    await User.deleteMany({})
  })

  describe('When creating a new user', () => {
    it('should successfully create a new user', async () => {
      const newUser = {
        name: 'John Doe',
        password: '1234',
        email: 'johndoe@example.com',
      }

      const { body, status } = await global.testRequest
        .post('/user')
        .send(newUser)

      expect(body).toMatchObject(newUser)
      expect(status).toBe(201)
    })
  })
})

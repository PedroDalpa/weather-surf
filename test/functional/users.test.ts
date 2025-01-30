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

    it('should return 409 when the email is already register', async () => {
      const newUser = {
        name: 'John Doe',
        password: '1234',
        email: 'johndoe@example.com',
      }

      await global.testRequest.post('/user').send(newUser)
      const { status, body } = await global.testRequest
        .post('/user')
        .send(newUser)

      expect(status).toBe(409)
      expect(body).toEqual({
        code: 409,
        error: 'User validation failed: email: already exist in the database.',
      })
    })

    it('should return 422 when field name is empty', async () => {
      const invalidUser = {
        name: '',
        password: '1245',
        email: 'email@test.com',
      }

      const { status, body } = await global.testRequest
        .post('/user')
        .send(invalidUser)

      expect(status).toBe(422)
      expect(body).toEqual({
        code: 422,
        error: 'User validation failed: name: Path `name` is required.',
      })
    })

    it('should return 422 when field password is empty', async () => {
      const invalidUser = {
        name: 'John doe',
        password: '',
        email: 'email@test.com',
      }

      const { status, body } = await global.testRequest
        .post('/user')
        .send(invalidUser)

      expect(status).toBe(422)
      expect(body).toEqual({
        code: 422,
        error: 'User validation failed: password: Path `password` is required.',
      })
    })

    it('should return 422 when field email is empty', async () => {
      const invalidUser = {
        name: 'John doe',
        password: '1234',
        email: '',
      }

      const { status, body } = await global.testRequest
        .post('/user')
        .send(invalidUser)

      expect(status).toBe(422)
      expect(body).toEqual({
        code: 422,
        error: 'User validation failed: email: Path `email` is required.',
      })
    })
  })
})

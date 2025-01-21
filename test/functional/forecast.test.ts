import supertest from 'supertest'
import { App } from 'supertest/types'

describe('Beach forecast functional tests', () => {
  it('should return a forecast with just a few times', async () => {
    const app:App = {} as App
    const { body, status } = await supertest(app).get('/forecast')
    expect(status).toBe(200)
    expect(body).toBeInstanceOf(Array)
  })
})
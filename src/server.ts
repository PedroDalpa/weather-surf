import './utils/module-alias'
import { Server } from '@overnightjs/core'
import { Application } from 'express'
import bodyParser from 'body-parser'
import { ForecastController } from './controllers/forecast'
import { connectDB, disconnectDB } from './database'
import { BeachController } from './controllers/beaches'
import * as http from 'http'
import { UserController } from './controllers/user'

export class SetupServer extends Server {
  private server?: http.Server

  constructor(private port = 3000) {
    super()
  }

  public async init(): Promise<void> {
    this.setupExpress()
    this.setupControllers()
    await this.databaseSetup()
  }

  private setupExpress(): void {
    this.app.use(bodyParser.json())
    this.setupControllers()
  }

  private setupControllers(): void {
    const userController = new UserController()
    const forecastController = new ForecastController()
    const beachController = new BeachController()
    this.addControllers([forecastController, beachController, userController])
  }

  private async databaseSetup(): Promise<void> {
    await connectDB()
  }

  public async close(): Promise<void> {
    await disconnectDB()
  }

  public getApp(): Application {
    return this.app
  }

  public start(): void {
    this.server = this.app.listen(this.port, () => {
      console.log('Server listening on port: ' + this.port)
    })
  }
}

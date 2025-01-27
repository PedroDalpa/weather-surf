import './utils/module-alias'
import { Server } from '@overnightjs/core'
import { Application } from 'express'
import bodyParser from 'body-parser'
import { ForecastController } from './controllers/forecast'
import { connectDB, disconnectDB } from './database'
import { BeachController } from './controllers/beaches'

export class SetupServer extends Server {
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
    const forecastController = new ForecastController()
    const beachController = new BeachController()
    this.addControllers([forecastController, beachController])
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
}

import config, { IConfig } from 'config'
import { connect, connection } from 'mongoose'

const dbConfig: IConfig = config.get('App.database')

export const connectDB = async (): Promise<void> => {
  await connect(dbConfig.get('mongoUrl'))
}

export const disconnectDB = (): Promise<void> => connection.close()

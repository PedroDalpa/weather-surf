import { scrypt } from 'crypto'
import jwt from 'jsonwebtoken'
import { promisify } from 'util'
import config from 'config'

const scryptAsync = promisify(scrypt)

export default class AuthService {
  public static async comparePassword(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return (await this.hashPassword(password)) == hashedPassword
  }

  public static async hashPassword(
    password: string,
    salt = 'sha256'
  ): Promise<string> {
    const derivedKey = (await scryptAsync(password, salt, 64)) as Buffer
    return derivedKey.toString('hex')
  }

  public static generateToken(payload: object): string {
    return jwt.sign(payload, config.get('App.auth.key') as string, {
      expiresIn: config.get('App.auth.tokenExpiresIn'),
    })
  }
}

import { scrypt } from 'crypto'
import { promisify } from 'util'

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
}

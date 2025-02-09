import AuthService from '@src/services/auth'
import { NextFunction, Request, Response } from 'express'

export function authMiddleware(
  req: Partial<Request>,
  res: Partial<Response>,
  next: NextFunction
): void {
  const token = req.headers?.['x-access-token']
  if (!token) {
    res.status?.(401).send({ code: 401, error: 'Unauthorized' })
  }

  try {
    const decoded = AuthService.decodeToken(token as string)
    req.decoded = decoded
    next()
  } catch (_) {
    res.status?.(401).send({ code: 401, error: 'Unauthorized' })
  }
}

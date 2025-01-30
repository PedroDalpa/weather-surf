import mongoose, { Model } from 'mongoose'
import { CUSTOM_VALIDATION } from '.'

export interface User {
  _id?: string
  name: string
  email: string
  password: string
}

const schema = new mongoose.Schema<User>(
  {
    email: {
      type: String,
      required: true,
      unique: [true, 'Email must be unique'],
    },
    name: { type: String, required: true },
    password: { type: String, required: true },
  },
  {
    toJSON: {
      transform: (_, ret) => {
        ret.id = ret._id
        delete ret._id
        delete ret.__v
        return ret
      },
    },
  }
)

schema.path('email').validate(
  async (email: string) => {
    const emailCount = await mongoose.models.User.countDocuments({ email })
    return !emailCount
  },
  'already exist in the database.',
  CUSTOM_VALIDATION.DUPLICATED
)

export const User: Model<User> = mongoose.model('User', schema)

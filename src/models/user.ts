import mongoose, { Model } from 'mongoose'

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

export const User: Model<User> = mongoose.model('User', schema)

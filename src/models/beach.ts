import mongoose, { Model } from 'mongoose'

export enum BeachPosition {
  S = 'S',
  E = 'E',
  N = 'N',
  W = 'W',
}

export interface Beach {
  _id?: string
  name: string
  lat: number
  lng: number
  position: BeachPosition
}

const schema = new mongoose.Schema<Beach>(
  {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    name: { type: String, required: true },
    position: { type: String, required: true },
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

export const Beach: Model<Beach> = mongoose.model('Beach', schema)

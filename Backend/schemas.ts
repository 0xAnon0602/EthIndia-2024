import { Hash, Schema, U32, U64 } from "@truenetworkio/sdk"

export const userProfile = Schema.create({
  totalFlips: U64,
  wins: U64,
  loss: U64,
})

export const flip = Schema.create({
  result: U64,
  timestamp: U64
})

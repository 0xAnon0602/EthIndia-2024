
import { TrueApi, testnet } from '@truenetworkio/sdk'
import { TrueConfig } from '@truenetworkio/sdk/dist/utils/cli-config'

// If you are not in a NodeJS environment, please comment the code following code:
import dotenv from 'dotenv'
import {flip, userProfile } from '../schemas'
dotenv.config()

export const getTrueNetworkInstance = async (): Promise<TrueApi> => {
  const trueApi = await TrueApi.create(config.account.secret, config.network)

  console.log(trueApi.account.address)
  await trueApi.setIssuer(config.issuer.hash)

  return trueApi;
}

export const config: TrueConfig = {
  network: testnet,
  account: {
    address: 'nQ7Cdemtv5Lpj5Q3goN2EZo9HNy9NiTMdevU3yvKHeg5XGY',
    secret: process.env.TRUE_NETWORK_SECRET_KEY ?? ''
  },
  issuer: {
    name: 'anon0602',
    hash: '0xa488e0f133c26620fbc56ef6b8452efd39125db54df09ed1fcea3ade4a218ff6'
  },
  algorithm: {
    id: undefined,
    path: 'acm',
    schemas: [flip,userProfile]
  },
}

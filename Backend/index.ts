import { flip, userProfile } from './schemas'
import { getTrueNetworkInstance } from './true-network/true.config'

const main = async (_wallet: string ,_flipResult: number) => {
  const api = await getTrueNetworkInstance()

  console.log(await flip.attest(api, _wallet, {
    result: _flipResult,
    timestamp: Math.floor(Date.now() / 1000)
  }))

  // console.log(await userProfile.attest(api, _wallet, {
  //   radioScore: 14,
  //   miles: 18
  // }))


  await api.network.disconnect()
}

main('0x4838B106FCe9647Bdf1E7877BF73cE8B0BAD5f97',1)
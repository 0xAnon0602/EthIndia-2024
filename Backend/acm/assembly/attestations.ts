
// Auto Generated File.
// Created using Reputation CLI from True Network.
// To update the classes, use the "reputation-cli acm-prepare" at the root directory that contains "true-network".

@inline
function readMemory<T>(index: usize): T {
  return load<T>(index);
}


class FLIP {
  timestamp: u64;
  result: u64;

  constructor() {
    this.timestamp = readMemory<u64>(0);
    this.result = readMemory<u64>(8);
  }
}


class USERPROFILE {
  wins: u64;
  totalFlips: u64;
  loss: u64;

  constructor() {
    this.wins = readMemory<u64>(16);
    this.totalFlips = readMemory<u64>(24);
    this.loss = readMemory<u64>(32);
  }
}


export class Attestations {
  static flip: FLIP = new FLIP();
  static userProfile: USERPROFILE = new USERPROFILE();
}

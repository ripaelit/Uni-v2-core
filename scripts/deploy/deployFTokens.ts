import {ethers} from 'hardhat'
import {deployFTokens} from '../utils/deployUtils'

export default async function main() {
  let [owner] = await ethers.getSigners();
  const balance = await ethers.provider.getBalance(owner.address);
  console.log(owner.address, {balance});

  await deployFTokens()
}

if (require.main === module) {
  main()
}

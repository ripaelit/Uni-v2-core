import {ethers} from 'hardhat'
import { deployAll } from '../utils/deployUtils';

export default async function main() {
  let [owner] = await ethers.getSigners();
  const balance = await ethers.provider.getBalance(owner.address);
  console.log(owner.address, {balance});

  // 1  Deploy UniswapV2Factory
  // 2  UniswapV2Factory.setFeeTo()
  
  // const txIds:number[] = [1,2,3];
  const txIds:number[] = [1,2];
  await deployAll(txIds);
}

if (require.main === module) {
  main()
}

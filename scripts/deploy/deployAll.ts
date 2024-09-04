import {ethers} from 'hardhat'
import { deployAll } from '../utils/deployUtils';

export default async function main() {
  let [owner] = await ethers.getSigners();
  const balance = await ethers.provider.getBalance(owner.address);
  console.log(owner.address, {balance});

  // 1  Deploy OracleContract
  // 2  Deploy OracleContractV2
  // 3  Deploy SecretContract
  // 4  Deploy FairSwapFactory
  // 5  Deploy FairSwapRouter
  // 6  Config OracleContract
  // 7  Config OracleContractV2
  // 8  FairSwapFactory.setOracle()
  // 9  FairSwapFactory.setSecret()
  // 10 FairSwapFactory.setFeeTo()
  // 11 FairSwapFactory.setPairLeverage(pair,percentValue)
  // 12 FairSwapFactory.setPairLeverage(tokenA,tokenB,percentValue)
  
  // const txIds:number[] = [1,2,3,4,5,6,7,8,9,10,11,12];
  const txIds:number[] = [2,5];
  await deployAll(txIds);
}

if (require.main === module) {
  main()
}

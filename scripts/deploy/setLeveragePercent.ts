import {ethers} from 'hardhat'
import { setLeverage } from '../utils/deployUtils';
import fs from 'fs'
import hre from 'hardhat';

export default async function main() {
  let [owner] = await ethers.getSigners();
  const balance = await ethers.provider.getBalance(owner.address);
  console.log(owner.address, {balance});
  const network = hre.network.name;

  try {
    const jsonObj = JSON.parse(fs.readFileSync('FairSwapFactory.json', 'utf-8'));
    const factoryAddress = jsonObj[network].factory;
    const factory = await ethers.getContractAt("FairSwapFactory", factoryAddress);
    
    // Customize tokens and percent
    await setLeverage(factory, "0x423578148B0b738241fF986d5204cFD25A60b9c0", "0xc71e631BA7dF59018C85ce63BD48189946459CE8", 500);
    await setLeverage(factory, "0x423578148B0b738241fF986d5204cFD25A60b9c0", "0xAbB92391770bD65989db3f64430AD7C15c0ae235", 200);
    await setLeverage(factory, "0xc71e631BA7dF59018C85ce63BD48189946459CE8", "0xAbB92391770bD65989db3f64430AD7C15c0ae235", 400);
    //...
  } catch (error) {
    throw(error);
  }
}

if (require.main === module) {
  main()
}

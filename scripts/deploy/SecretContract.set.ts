import {ethers} from 'hardhat'
import fs from 'fs'
import hre from 'hardhat';

// Input new secret address
const newSecretAddress = "";

export default async function main() {
  let [owner] = await ethers.getSigners();
  const balance = await ethers.provider.getBalance(owner.address);
  console.log(owner.address, {balance});
  const network = hre.network.name;

  try {
    const jsonObj = JSON.parse(fs.readFileSync('deployment.json', 'utf-8'));
    const factoryAddress = jsonObj[network].factory;
    const factory = await ethers.getContractAt('FairSwapFactory', factoryAddress);
    let tx = await factory.setSecret(newSecretAddress);
    await tx.wait();
  } catch (error) {
    throw(error);
  }
}

if (require.main === module) {
  main()
}

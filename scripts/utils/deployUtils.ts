import { ethers, network, run } from "hardhat"
import {chainIds, amoyData, mumbaiData, polygonData} from "../constants"
import { BigNumber, BigNumberish, Contract } from "ethers"
import fs from 'fs';
import hre from 'hardhat';

export const getTargetAddress = (fileName:string, network: string, contractName: string) => {
  let jsonObj;
  try {
    if (!fs.existsSync(fileName)) {
      jsonObj = Object.create({});
      jsonObj[network] = {};
      fs.writeFileSync(fileName, JSON.stringify(jsonObj));
      console.log(`Created ${fileName}`);
    }
  } catch (error) {
    throw(error);
  }
  jsonObj = JSON.parse(fs.readFileSync(fileName, 'utf-8'));
  if (!jsonObj[network]) {
    throw new Error("Target is not found");
  }

  return jsonObj[network][contractName];
};

export const setTargetAddress = async (
  fileName: string,
  network: string,
  contractName: string,
  address: string
) => {
  let jsonObj;
  try {
    if (!fs.existsSync(fileName)) {
      jsonObj = Object.create({});
      jsonObj[network] = {};
      fs.writeFileSync(fileName, JSON.stringify(jsonObj));
      console.log(`Created ${fileName}`);
    }
  } catch (error) {
    throw(error);
  }

  try {
    jsonObj = JSON.parse(fs.readFileSync(fileName, 'utf-8'));
    if (!jsonObj[network]) {
      jsonObj[network] = {};
    }
    jsonObj[network][contractName] = address;
    fs.writeFileSync(fileName, JSON.stringify(jsonObj));
    console.log(
      `${network} | ${contractName} | ${jsonObj[network][contractName]}`
    );
  } catch (error) {
    throw(error);
  }
};

export const deployFactory = async () => {
  try {
    const network = hre.network.name;
    let [deployer] = await ethers.getSigners();
    const UniswapV2Factory = await ethers.getContractFactory("UniswapV2Factory");
    const feeToSetter = deployer.address;
    const factory = await UniswapV2Factory.deploy(feeToSetter);
    await factory.deployed();
    const factoryAddress = factory.address;
    setTargetAddress('deployment.json', network, 'UniswapV2Factory', factoryAddress);
    return factoryAddress;
  } catch (error) {
    throw(error);
  }
}

export const verifyContract = async (fileName:string, contractName:string, args:Array<any>) => {
  const network = hre.network.name;
  try {
    const contractAddr = getTargetAddress(fileName, network, contractName);
    await run(`verify:verify`, {
      address: contractAddr,
      constructorArguments: args,
    });
    console.log(`Verified ${contractName} in ${network}`);
  } catch (error) {
    throw(error);
  }
}

export const deployRouter = async (
  network:string,
  factory:string,
) => {
  try {
    const chainId = hre.network.config.chainId!;
    const weth = getWETH(chainId);
    const FairSwapRouter = await ethers.getContractFactory('FairSwapRouter');
    const router = await FairSwapRouter.deploy(
      factory,
      weth
    );
    await router.deployed();
    const routerAddress = router.address;
    let jsonObj = JSON.parse(fs.readFileSync('deployment.json', 'utf-8'));
    jsonObj[network].router = routerAddress;
    const json = JSON.stringify(jsonObj);
    fs.writeFileSync('deployment.json', json);
    return routerAddress;
  } catch (error) {
    throw(error);
  }
}

export const getWETH = (
  chainId:number
) => {
  try {
    switch (chainId) {
      case chainIds.polygon:
        return polygonData.wmatic;
  
      case chainIds.polygonMumbai:
        return mumbaiData.wmatic;
  
      case chainIds.polygonAmoy:
        return amoyData.wmatic;
  
      default:
        console.log({chainId});
        throw new Error("Invalid chain id");
    }
  } catch (error) {
    throw(error);
  }
}

export const deployAll = async (
  txIds:number[]
) => {
  let [deployer] = await ethers.getSigners();
  const network = hre.network.name;

  let factoryAddress:string = "";

  if (txIds.includes(1)) {
    factoryAddress = await deployFactory();
    console.log(`Success tx 1: Deployed Factory to ${factoryAddress}`);
  } else {
    try {
      factoryAddress = getTargetAddress('deployment.json', network, 'UniswapV2Factory');
    } catch (error) {
      throw(error);
    }
  }

  if (txIds.includes(2)) {
    try {
      const factory = await ethers.getContractAt("UniswapV2Factory", factoryAddress);
      let tx = await factory.setFeeTo(deployer.address);
      await tx.wait();
      console.log(`Success tx 2: Set FeeTo ${deployer.address}`);
    } catch (error) {
      throw(error);
    }
  }
}

export const verifyAll = async () => {
  let [deployer] = await ethers.getSigners();
  await verifyContract('deployment.json', 'UniswapV2Factory', [deployer.address])
}
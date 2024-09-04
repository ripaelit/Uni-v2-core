import { ethers, network, run } from "hardhat"
import {chainIds, amoyData, mumbaiData, polygonData} from "../constants"
import { BigNumber, BigNumberish, Contract } from "ethers"
import fs from 'fs';
import hre from 'hardhat';

export const configOracle = async (
  oracleAddress:string
) => {
  const network = hre.network.name;
  let priceFeeds = [];
  let jsonObj;

  try {
    if (network == "polygon") {
      // real tokens
      if (polygonData.wbtc) priceFeeds.push({"assetA": polygonData.wbtc, "assetB": ethers.constants.AddressZero, "aggregator": polygonData.btcAggregator});
      if (polygonData.weth) priceFeeds.push({"assetA": polygonData.weth, "assetB": ethers.constants.AddressZero, "aggregator": polygonData.ethAggregator});
      if (polygonData.wmatic) priceFeeds.push({"assetA": polygonData.wmatic, "assetB": ethers.constants.AddressZero, "aggregator": polygonData.maticAggregator});
      if (polygonData.usdt) priceFeeds.push({"assetA": polygonData.usdt, "assetB": ethers.constants.AddressZero, "aggregator": polygonData.usdtAggregator});
      if (polygonData.usdc) priceFeeds.push({"assetA": polygonData.usdc, "assetB": ethers.constants.AddressZero, "aggregator": polygonData.usdcAggregator});
      if (polygonData.dai) priceFeeds.push({"assetA": polygonData.dai, "assetB": ethers.constants.AddressZero, "aggregator": polygonData.daiAggregator});
  
      // fake tokens
      jsonObj = JSON.parse(fs.readFileSync('deployFTokens.json', 'utf-8'));
      let ftokens = jsonObj[network];
      if (ftokens.FWBTC) priceFeeds.push({"assetA": ftokens.FWBTC.address, "assetB": ethers.constants.AddressZero, "aggregator": polygonData.btcAggregator});
      if (ftokens.FWETH) priceFeeds.push({"assetA": ftokens.FWETH.address, "assetB": ethers.constants.AddressZero, "aggregator": polygonData.ethAggregator});
      if (ftokens.FUSDT) priceFeeds.push({"assetA": ftokens.FUSDT.address, "assetB": ethers.constants.AddressZero, "aggregator": polygonData.usdtAggregator});
      if (ftokens.FUSDC) priceFeeds.push({"assetA": ftokens.FUSDC.address, "assetB": ethers.constants.AddressZero, "aggregator": polygonData.usdcAggregator});
      if (ftokens.FDAI) priceFeeds.push({"assetA": ftokens.FDAI.address, "assetB": ethers.constants.AddressZero, "aggregator": polygonData.daiAggregator});
      if (ftokens.FSOL) priceFeeds.push({"assetA": ftokens.FSOL.address, "assetB": ethers.constants.AddressZero, "aggregator": polygonData.solAggregator});
      if (ftokens.FDOGE) priceFeeds.push({"assetA": ftokens.FDOGE.address, "assetB": ethers.constants.AddressZero, "aggregator": polygonData.dogeAggregator});
      if (ftokens.FXAU) priceFeeds.push({"assetA": ftokens.FXAU.address, "assetB": ethers.constants.AddressZero, "aggregator": polygonData.xauAggregator});
    } else if (network == "polygonMumbai") {
      // real tokens
      if (mumbaiData.wmatic) priceFeeds.push({"assetA": mumbaiData.wmatic, "assetB": ethers.constants.AddressZero, "aggregator": mumbaiData.maticAggregator});
  
      // fake tokens
      jsonObj = JSON.parse(fs.readFileSync('deployFTokens.json', 'utf-8'));
      let ftokens = jsonObj[network];
      if (ftokens.FWBTC) priceFeeds.push({"assetA": ftokens.FWBTC.address, "assetB": ethers.constants.AddressZero, "aggregator": mumbaiData.btcAggregator});
      if (ftokens.FWETH) priceFeeds.push({"assetA": ftokens.FWETH.address, "assetB": ethers.constants.AddressZero, "aggregator": mumbaiData.ethAggregator});
      if (ftokens.FUSDT) priceFeeds.push({"assetA": ftokens.FUSDT.address, "assetB": ethers.constants.AddressZero, "aggregator": mumbaiData.usdtAggregator});
      if (ftokens.FUSDC) priceFeeds.push({"assetA": ftokens.FUSDC.address, "assetB": ethers.constants.AddressZero, "aggregator": mumbaiData.usdcAggregator});
      if (ftokens.FDAI) priceFeeds.push({"assetA": ftokens.FDAI.address, "assetB": ethers.constants.AddressZero, "aggregator": mumbaiData.daiAggregator});
      if (ftokens.FSOL) priceFeeds.push({"assetA": ftokens.FSOL.address, "assetB": ethers.constants.AddressZero, "aggregator": mumbaiData.solAggregator});
      if (ftokens.FDOGE) priceFeeds.push({"assetA": ftokens.FDOGE.address, "assetB": ethers.constants.AddressZero, "aggregator": mumbaiData.dogeAggregator});
      if (ftokens.FXAU) priceFeeds.push({"assetA": ftokens.FXAU.address, "assetB": ethers.constants.AddressZero, "aggregator": mumbaiData.xauAggregator});
    } else if (network == "polygonAmoy") {
      // real tokens
      if (amoyData.wmatic) priceFeeds.push({"assetA": amoyData.wmatic, "assetB": ethers.constants.AddressZero, "aggregator": amoyData.maticAggregator});
  
      // fake tokens
      jsonObj = JSON.parse(fs.readFileSync('deployFTokens.json', 'utf-8'));
      let ftokens = jsonObj[network];
      if (ftokens.FWBTC) priceFeeds.push({"assetA": ftokens.FWBTC.address, "assetB": ethers.constants.AddressZero, "aggregator": amoyData.btcAggregator});
      if (ftokens.FWETH) priceFeeds.push({"assetA": ftokens.FWETH.address, "assetB": ethers.constants.AddressZero, "aggregator": amoyData.ethAggregator});
      if (ftokens.FUSDT) priceFeeds.push({"assetA": ftokens.FUSDT.address, "assetB": ethers.constants.AddressZero, "aggregator": amoyData.usdtAggregator});
      if (ftokens.FUSDC) priceFeeds.push({"assetA": ftokens.FUSDC.address, "assetB": ethers.constants.AddressZero, "aggregator": amoyData.usdcAggregator});
      if (ftokens.FDAI) priceFeeds.push({"assetA": ftokens.FDAI.address, "assetB": ethers.constants.AddressZero, "aggregator": amoyData.daiAggregator});
      if (ftokens.FSOL) priceFeeds.push({"assetA": ftokens.FSOL.address, "assetB": ethers.constants.AddressZero, "aggregator": amoyData.solAggregator});
      if (ftokens.FDOGE) priceFeeds.push({"assetA": ftokens.FDOGE.address, "assetB": ethers.constants.AddressZero, "aggregator": amoyData.dogeAggregator});
      if (ftokens.FXAU) priceFeeds.push({"assetA": ftokens.FXAU.address, "assetB": ethers.constants.AddressZero, "aggregator": amoyData.xauAggregator});
    } else {
      throw new Error("Invalid network");
    }
  
    const oracle = await ethers.getContractAt("OracleContract", oracleAddress);
    let tx = await oracle.setAggregators(priceFeeds);
    await tx.wait();
    console.log(`setAggregators(${priceFeeds})`);
  } catch (error) {
    throw(error);
  }
}

export const configOracleV2 = async (
  oracleV2Address:string
) => {
  const network = hre.network.name;
  let priceFeeds = [];
  let pythAddress = "";
  let jsonObj;

  try {
    if (network == "polygon") {
      pythAddress = polygonData.pyth;  // Refer to https://docs.pyth.network/documentation/pythnet-price-feeds/evm
  
      // real tokens
      if (polygonData.wbtc) priceFeeds.push({"assetA": polygonData.wbtc, "assetB": ethers.constants.AddressZero, "priceId": polygonData.btcPriceId});
      if (polygonData.weth) priceFeeds.push({"assetA": polygonData.weth, "assetB": ethers.constants.AddressZero, "priceId": polygonData.ethPriceId});
      if (polygonData.wmatic) priceFeeds.push({"assetA": polygonData.wmatic, "assetB": ethers.constants.AddressZero, "priceId": polygonData.maticPriceId});
      if (polygonData.usdt) priceFeeds.push({"assetA": polygonData.usdt, "assetB": ethers.constants.AddressZero, "priceId": polygonData.usdtPriceId});
      if (polygonData.usdc) priceFeeds.push({"assetA": polygonData.usdc, "assetB": ethers.constants.AddressZero, "priceId": polygonData.usdcPriceId});
      if (polygonData.dai) priceFeeds.push({"assetA": polygonData.dai, "assetB": ethers.constants.AddressZero, "priceId": polygonData.daiPriceId});
  
      // fake tokens
      jsonObj = JSON.parse(fs.readFileSync('deployFTokens.json', 'utf-8'));
      let ftokens = jsonObj[network];
      if (ftokens.FWBTC) priceFeeds.push({"assetA": ftokens.FWBTC.address, "assetB": ethers.constants.AddressZero, "priceId": polygonData.btcPriceId});
      if (ftokens.FWETH) priceFeeds.push({"assetA": ftokens.FWETH.address, "assetB": ethers.constants.AddressZero, "priceId": polygonData.ethPriceId});
      if (ftokens.FUSDT) priceFeeds.push({"assetA": ftokens.FUSDT.address, "assetB": ethers.constants.AddressZero, "priceId": polygonData.usdtPriceId});
      if (ftokens.FUSDC) priceFeeds.push({"assetA": ftokens.FUSDC.address, "assetB": ethers.constants.AddressZero, "priceId": polygonData.usdcPriceId});
      if (ftokens.FDAI) priceFeeds.push({"assetA": ftokens.FDAI.address, "assetB": ethers.constants.AddressZero, "priceId": polygonData.daiPriceId});
      if (ftokens.FSOL) priceFeeds.push({"assetA": ftokens.FSOL.address, "assetB": ethers.constants.AddressZero, "priceId": polygonData.solPriceId});
      if (ftokens.FDOGE) priceFeeds.push({"assetA": ftokens.FDOGE.address, "assetB": ethers.constants.AddressZero, "priceId": polygonData.dogePriceId});
      if (ftokens.FXAU) priceFeeds.push({"assetA": ftokens.FXAU.address, "assetB": ethers.constants.AddressZero, "priceId": polygonData.xauPriceId});
    } else if (network == "polygonMumbai") {
      pythAddress = mumbaiData.pyth;  // Refer to https://docs.pyth.network/documentation/pythnet-price-feeds/evm
      
      // real tokens
      if (mumbaiData.wmatic) priceFeeds.push({"assetA": mumbaiData.wmatic, "assetB": ethers.constants.AddressZero, "priceId": mumbaiData.maticPriceId});
  
      // fake tokens
      jsonObj = JSON.parse(fs.readFileSync('deployFTokens.json', 'utf-8'));
      let ftokens = jsonObj[network];
      if (ftokens.FWBTC) priceFeeds.push({"assetA": ftokens.FWBTC.address, "assetB": ethers.constants.AddressZero, "priceId": mumbaiData.btcPriceId});
      if (ftokens.FWETH) priceFeeds.push({"assetA": ftokens.FWETH.address, "assetB": ethers.constants.AddressZero, "priceId": mumbaiData.ethPriceId});
      if (ftokens.FUSDT) priceFeeds.push({"assetA": ftokens.FUSDT.address, "assetB": ethers.constants.AddressZero, "priceId": mumbaiData.usdtPriceId});
      if (ftokens.FUSDC) priceFeeds.push({"assetA": ftokens.FUSDC.address, "assetB": ethers.constants.AddressZero, "priceId": mumbaiData.usdcPriceId});
      if (ftokens.FDAI) priceFeeds.push({"assetA": ftokens.FDAI.address, "assetB": ethers.constants.AddressZero, "priceId": mumbaiData.daiPriceId});
      if (ftokens.FSOL) priceFeeds.push({"assetA": ftokens.FSOL.address, "assetB": ethers.constants.AddressZero, "priceId": mumbaiData.solPriceId});
      if (ftokens.FDOGE) priceFeeds.push({"assetA": ftokens.FDOGE.address, "assetB": ethers.constants.AddressZero, "priceId": mumbaiData.dogePriceId});
      if (ftokens.FXAU) priceFeeds.push({"assetA": ftokens.FXAU.address, "assetB": ethers.constants.AddressZero, "priceId": mumbaiData.xauPriceId});
    } else if (network == "polygonAmoy") {
      pythAddress = amoyData.pyth;  // Refer to https://docs.pyth.network/documentation/pythnet-price-feeds/evm
      
      // real tokens
      if (amoyData.wmatic) priceFeeds.push({"assetA": amoyData.wmatic, "assetB": ethers.constants.AddressZero, "priceId": amoyData.maticPriceId});
  
      // fake tokens
      jsonObj = JSON.parse(fs.readFileSync('deployFTokens.json', 'utf-8'));
      let ftokens = jsonObj[network];
      if (ftokens.FWBTC) priceFeeds.push({"assetA": ftokens.FWBTC.address, "assetB": ethers.constants.AddressZero, "priceId": amoyData.btcPriceId});
      if (ftokens.FWETH) priceFeeds.push({"assetA": ftokens.FWETH.address, "assetB": ethers.constants.AddressZero, "priceId": amoyData.ethPriceId});
      if (ftokens.FUSDT) priceFeeds.push({"assetA": ftokens.FUSDT.address, "assetB": ethers.constants.AddressZero, "priceId": amoyData.usdtPriceId});
      if (ftokens.FUSDC) priceFeeds.push({"assetA": ftokens.FUSDC.address, "assetB": ethers.constants.AddressZero, "priceId": amoyData.usdcPriceId});
      if (ftokens.FDAI) priceFeeds.push({"assetA": ftokens.FDAI.address, "assetB": ethers.constants.AddressZero, "priceId": amoyData.daiPriceId});
      if (ftokens.FSOL) priceFeeds.push({"assetA": ftokens.FSOL.address, "assetB": ethers.constants.AddressZero, "priceId": amoyData.solPriceId});
      if (ftokens.FDOGE) priceFeeds.push({"assetA": ftokens.FDOGE.address, "assetB": ethers.constants.AddressZero, "priceId": amoyData.dogePriceId});
      if (ftokens.FXAU) priceFeeds.push({"assetA": ftokens.FXAU.address, "assetB": ethers.constants.AddressZero, "priceId": amoyData.xauPriceId});
    } else {
      throw new Error("Invalid network");
    }
  
    const oracle = await ethers.getContractAt("OracleContractV2", oracleV2Address);
    let tx = await oracle.setPythContract(pythAddress);
    await tx.wait();
    tx = await oracle.setPriceIds(priceFeeds);
    await tx.wait();
  } catch (error) {
    throw(error);
  }
}

export const deployOracle = async (network:string) => {
  try {
    const OracleContract = await ethers.getContractFactory("OracleContract");
    const oracle = await OracleContract.deploy();
    await oracle.deployed();
    const oracleAddress = oracle.address;
    let jsonObj = JSON.parse(fs.readFileSync('deployment.json', 'utf-8'));
    jsonObj[network].oracle = oracleAddress;
    const json = JSON.stringify(jsonObj);
    fs.writeFileSync('deployment.json', json);
    return oracleAddress;
  } catch (error) {
    throw(error);
  }
}

export const verifyOracle = async (
  network:string
) => {
  let jsonObj = JSON.parse(fs.readFileSync('deployment.json', 'utf-8'));
  const oracleAddress = jsonObj[network].oracle;
  await run(`verify:verify`, {
    address: oracleAddress,
    constructorArguments: [],
  })
}

export const deployOracleV2 = async (network:string) => {
  try {
    const OracleContractV2 = await ethers.getContractFactory("OracleContractV2");
    const oracleV2 = await OracleContractV2.deploy();
    await oracleV2.deployed();
    const oracleV2Address = oracleV2.address;
    let jsonObj = JSON.parse(fs.readFileSync('deployment.json', 'utf-8'));
    jsonObj[network].oracleV2 = oracleV2Address;
    const json = JSON.stringify(jsonObj);
    fs.writeFileSync('deployment.json', json);
    return oracleV2Address;
  } catch (error) {
    throw(error);
  }
}

export const verifyOracleV2 = async (
  network:string
) => {
  let jsonObj = JSON.parse(fs.readFileSync('deployment.json', 'utf-8'));
  const oracleV2Address = jsonObj[network].oracleV2;
  await run(`verify:verify`, {
    address: oracleV2Address,
    constructorArguments: [],
  })
}

export const deploySecret = async (network:string) => {
  try {
    const SecretContract = await ethers.getContractFactory("SecretContract");
    const secret = await SecretContract.deploy();
    await secret.deployed();
    const secretAddress = secret.address;
    let jsonObj = JSON.parse(fs.readFileSync('deployment.json', 'utf-8'));
    jsonObj[network].secret = secretAddress;
    const json = JSON.stringify(jsonObj);
    fs.writeFileSync('deployment.json', json);
    return secretAddress;
  } catch (error) {
    throw(error);
  }
}

export const verifySecret = async (
  network:string
) => {
  let jsonObj = JSON.parse(fs.readFileSync('deployment.json', 'utf-8'));
  const secretAddress = jsonObj[network].secret;
  await run(`verify:verify`, {
    address: secretAddress,
    constructorArguments: [],
  })
}

export const deployFactory = async (network:string) => {
  try {
    let [owner] = await ethers.getSigners();
    const FairSwapFactory = await ethers.getContractFactory("FairSwapFactory");
    const feeToSetter = owner.address;
    const factory = await FairSwapFactory.deploy(feeToSetter);
    await factory.deployed();
    const factoryAddress = factory.address;
    let jsonObj = JSON.parse(fs.readFileSync('deployment.json', 'utf-8'));
    jsonObj[network].factory = factoryAddress;
    const json = JSON.stringify(jsonObj);
    fs.writeFileSync('deployment.json', json);
    return factoryAddress;
  } catch (error) {
    throw(error);
  }
}

export const verifyFactory = async (
  network:string
) => {
  let [owner] = await ethers.getSigners();
  let jsonObj = JSON.parse(fs.readFileSync('deployment.json', 'utf-8'));
  const factoryAddress = jsonObj[network].factory;
  const feeToSetter = owner.address;
  await run(`verify:verify`, {
    address: factoryAddress,
    constructorArguments: [feeToSetter],
  })
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

export const verifyRouter = async (
  network:string,
  factory:string
) => {
  let jsonObj = JSON.parse(fs.readFileSync('deployment.json', 'utf-8'));
  const routerAddress = jsonObj[network].router;
  const chainId = hre.network.config.chainId!;
  const weth = getWETH(chainId);
  await run(`verify:verify`, {
    address: routerAddress,
    constructorArguments: [factory, weth],
  })
}

export const deployMockToken = async (
  network:string,
  name:string,
  symbol:string,
  decimals:number
) => {
  try {
    const MockToken = await ethers.getContractFactory('MockToken');
    const token = await MockToken.deploy(name, symbol, decimals);
    await token.deployed();
    const tokenAddress = token.address;
    console.log(`Deployed ${symbol}`, tokenAddress);

    let jsonObj = JSON.parse(fs.readFileSync('deployFTokens.json', 'utf-8'));
    if (jsonObj[network] == undefined) {
      jsonObj[network] = {};
    }
    const tokenObj = {
      name: name,
      symbol: symbol,
      decimals: decimals,
      address: tokenAddress
    }
    jsonObj[network][symbol] = tokenObj;
    const json = JSON.stringify(jsonObj);
    fs.writeFileSync('deployFTokens.json', json);
    return tokenAddress;
  } catch (error) {
    throw(error);
  }
}

export const verifyMockToken = async (
  network:string,
  name:string,
  symbol:string,
  decimals:number
) => {
  try {
    let jsonObj = JSON.parse(fs.readFileSync('deployFTokens.json', 'utf-8'));
    const tokenAddress = jsonObj[network][symbol].address;
    console.log({tokenAddress})
    await run('verify:verify', {
      address: tokenAddress,
      constructorArguments: [name, symbol, decimals],
    });
    console.log(`Verified ${symbol}`);
  } catch (e) {
    throw(e);
  }
}

export const deployMockWETH = async (
  network:string,
  name:string, 
  symbol:string, 
  decimals:number
) => {
  try {
    const MockWETH = await ethers.getContractFactory('MockWETH');
    const weth = await MockWETH.deploy(name, symbol, decimals);
    await weth.deployed();
    const wethAddress = weth.address;
    console.log(`Deployed ${symbol}`, weth.address);

    let jsonObj = JSON.parse(fs.readFileSync('deployFTokens.json', 'utf-8'));
    if (jsonObj[network] == undefined) {
      jsonObj[network] = {};
    }
    const tokenObj = {
      name: name,
      symbol: symbol,
      decimals: decimals,
      address: wethAddress
    }
    jsonObj[network][symbol] = tokenObj;
    const json = JSON.stringify(jsonObj);
    fs.writeFileSync('deployFTokens.json', json);
    return wethAddress;
  } catch (error) {
    throw(error);
  }
}

export const verifyMockWETH = async (
  network:string,
  name:string,
  symbol:string,
  decimals:number
) => {
  try {
    let jsonObj = JSON.parse(fs.readFileSync('deployFTokens.json', 'utf-8'));
    const wethAddress = jsonObj[network][symbol].address;
    console.log({wethAddress})
    await run('verify:verify', {
      address: wethAddress,
      constructorArguments: [name, symbol, decimals],
    });
    console.log(`Verified ${symbol}`);
  } catch (e) {
    throw(e);
  }
}

export const deployMockAggregator = async (
  description:string,
  decimals:BigNumber|number,
  price:BigNumber|number
) => {
  try {
    const MockAggregator = await ethers.getContractFactory('MockAggregator');
    const aggregator = await MockAggregator.deploy(description, decimals, price);
    await aggregator.deployed();
    console.log("Deployed MockAggregator", description, decimals, price, aggregator.address);
    return aggregator;
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
  let [owner] = await ethers.getSigners();
  const network = hre.network.name;

  let oracleAddress:string = "";
  let oracleV2Address:string = "";
  let secretAddress:string = "";
  let factoryAddress:string = "";
  let routerAddress:string = "";
  let jsonObj;

  try {
    if (!fs.existsSync('deployment.json')) {
      jsonObj = Object.create({});
      jsonObj[network] = {};
      fs.writeFileSync('deployment.json', JSON.stringify(jsonObj));
      console.log('Created deployment.json');
    }
  } catch (error) {
    throw(error);
  }

  try {
    jsonObj = JSON.parse(fs.readFileSync('deployment.json', 'utf-8'));
    if (jsonObj[network] == undefined) {
      jsonObj[network] = {};
      fs.writeFileSync('deployment.json', JSON.stringify(jsonObj));
      console.log(`Added json for ${network}`);
    }
  } catch (error) {
    throw(error);
  }

  if (txIds.includes(1)) {
    oracleAddress = await deployOracle(network);
    console.log(`Success tx 1: Deployed Oracle to ${oracleAddress}`);
  } else {
    try {
      jsonObj = JSON.parse(fs.readFileSync('deployment.json', 'utf-8'));
      oracleAddress = jsonObj[network].oracle;
    } catch (error) {
      throw(error);
    }
  }

  if (txIds.includes(2)) {
    oracleV2Address = await deployOracleV2(network);
    console.log(`Success tx 2: Deployed OracleV2 to ${oracleV2Address}`);
  } else {
    try {
      jsonObj = JSON.parse(fs.readFileSync('deployment.json', 'utf-8'));
      oracleV2Address = jsonObj[network].oracleV2;
    } catch (error) {
      throw(error);
    }
  }

  if (txIds.includes(3)) {
    secretAddress = await deploySecret(network);
    console.log(`Success tx 3: Deployed Secret to ${secretAddress}`);
  } else {
    try {
      jsonObj = JSON.parse(fs.readFileSync('deployment.json', 'utf-8'));
      secretAddress = jsonObj[network].secret;
    } catch (error) {
      throw(error);
    }
  }

  if (txIds.includes(4)) {
    factoryAddress = await deployFactory(network);
    console.log(`Success tx 4: Deployed Factory to ${factoryAddress}`);
  } else {
    try {
      jsonObj = JSON.parse(fs.readFileSync('deployment.json', 'utf-8'));
      factoryAddress = jsonObj[network].factory;
    } catch (error) {
      throw(error);
    }
  }

  if (txIds.includes(5)) {
    try {
      console.log({factoryAddress})
      if (!ethers.utils.isAddress(factoryAddress) || factoryAddress == ethers.constants.AddressZero) {
        throw new Error('Invalid Factory');
      }
      routerAddress = await deployRouter(network, factoryAddress);
      console.log(`Success tx 5: Deployed Router to ${routerAddress}`);
    } catch (error) {
      throw(error);
    }
  }

  if (txIds.includes(6)) {
    if (!ethers.utils.isAddress(oracleAddress) || oracleAddress == ethers.constants.AddressZero) {
      throw new Error('Invalid Oracle');
    }
    await configOracle(oracleAddress);
    console.log('Success tx 6: Configured Oracle');
  }

  if (txIds.includes(7)) {
    if (!ethers.utils.isAddress(oracleV2Address) || oracleV2Address == ethers.constants.AddressZero) {
      throw new Error('Invalid OracleV2');
    }
    await configOracleV2(oracleV2Address);
    console.log('Success tx 7: Configured OracleV2');
  }

  if (txIds.includes(8)) {
    try {
      const factory = await ethers.getContractAt("FairSwapFactory", factoryAddress);
      let tx = await factory.setOracle(oracleAddress);
      await tx.wait();
      console.log('Success tx 8: Set Oracle');
    } catch (error) {
      throw(error);
    }
  }

  if (txIds.includes(9)) {
    try {
      const factory = await ethers.getContractAt("FairSwapFactory", factoryAddress);
      let tx = await factory.setSecret(secretAddress);
      await tx.wait();
      console.log('Success tx 9: Set Secret');
    } catch (error) {
      throw(error);
    }
  }

  if (txIds.includes(10)) {
    try {
      const factory = await ethers.getContractAt("FairSwapFactory", factoryAddress);
      let tx = await factory.setFeeTo(owner.address);
      await tx.wait();
      console.log('Success tx 10: Set FeeTo');
    } catch (error) {
      throw(error);
    }
  }

  if (txIds.includes(11)) {
    try {
      const factory = await ethers.getContractAt("FairSwapFactory", factoryAddress);
      // Customize pair and percentValue
      const pair = "";
      const percentValue = 500;
  
      let tx = await factory["setPairLeverage(address,uint256)"](pair, percentValue);
      await tx.wait();
      console.log('Success tx 11: setPairLeverage(pair,percentValue)');
    } catch (error) {
      throw(error);
    }
  }

  if (txIds.includes(12)) {
    try {
      const factory = await ethers.getContractAt("FairSwapFactory", factoryAddress);
      // Customize tokenA, tokenB and percentValue
      const tokenA = "";
      const tokenB = "";
      const percentValue = 500;
      await setLeverage(factory, tokenA, tokenB, percentValue);
      console.log('Success tx 12: setPairLeverage(tokenA,tokenB,percentValue)');
    } catch (error) {
      throw(error);
    }
  }
}

export const verifyAll = async (txIds:number[]) => {
  const network = hre.network.name;

  if (txIds.includes(1)) {
    await verifyOracle(network);
  }
  if (txIds.includes(2)) {
    await verifyOracleV2(network);
  }
  if (txIds.includes(3)) {
    await verifySecret(network);
  }
  if (txIds.includes(4)) {
    await verifyFactory(network);
  }
  if (txIds.includes(5)) {
    let jsonObj = JSON.parse(fs.readFileSync('deployment.json', 'utf-8'));
    let factoryAddress = jsonObj[network].factory;
    await verifyRouter(network, factoryAddress);
  }
}

export const setLeverage = async (
  factory:Contract,
  tokenA:string, 
  tokenB:string, 
  percent:BigNumberish
) => {
  try {
    const pair = await factory.getPair(tokenA, tokenB);
    if (pair != ethers.constants.AddressZero) {
      let tx = await factory["setPairLeverage(address,address,uint256)"](tokenA, tokenB, percent);
      await tx.wait();
      console.log("setLeverage", {tokenA}, {tokenB}, {percent});
    } else {
      throw new Error("Pair doesn't exist.")
    }
  } catch (error) {
    throw(error);
  }
}

export const deployFTokens = async () => {
  const network = hre.network.name;
  await deployMockToken(network, 'FWBTC', 'FWBTC', 8);
  await deployMockToken(network, 'FWETH', 'FWETH', 18);
  await deployMockToken(network, 'FUSDT', 'FUSDT', 6);
  await deployMockToken(network, 'FUSDC', 'FUSDC', 6);
  await deployMockToken(network, 'FDAI', 'FDAI', 18);
  await deployMockToken(network, 'FSOL', 'FSOL', 18);
  await deployMockToken(network, 'FDOGE', 'FDOGE', 8);
  await deployMockToken(network, 'FXAU', 'FXAU', 6);
  await deployMockWETH(network, 'FWMATIC', 'FWMATIC', 18);
}

export const verifyFTokens = async () => {
  const network = hre.network.name;
  await verifyMockToken(network, 'FWBTC', 'FWBTC', 8);
  await verifyMockToken(network, 'FWETH', 'FWETH', 18);
  await verifyMockToken(network, 'FUSDT', 'FUSDT', 6);
  await verifyMockToken(network, 'FUSDC', 'FUSDC', 6);
  await verifyMockToken(network, 'FDAI', 'FDAI', 18);
  await verifyMockToken(network, 'FSOL', 'FSOL', 18);
  await verifyMockToken(network, 'FDOGE', 'FDOGE', 8);
  await verifyMockToken(network, 'FXAU', 'FXAU', 6);
  // await verifyMockWETH(network, 'FWMATIC', 'FWMATIC', 18);
}
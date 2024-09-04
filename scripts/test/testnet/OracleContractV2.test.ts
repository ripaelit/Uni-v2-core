import {expect} from 'chai';
import {ethers} from 'hardhat';
import {SignerWithAddress} from '@nomiclabs/hardhat-ethers/signers';
import { BigNumber, Contract } from 'ethers';
import fs from 'fs'

describe('OracleContractV2 Mumbai Test', () => {
  let owner:SignerWithAddress
  let oracle:Contract
  let price:BigNumber
  const json = JSON.parse(fs.readFileSync('deployMocks.json', 'utf-8'))
  const zeroAddress = ethers.constants.AddressZero

  before(async () => {
    [owner] = await ethers.getSigners()
    const balance = await ethers.provider.getBalance(owner.address)
    console.log({balance})
    
    const oracleV2Address = "0x15176d83aF1bE184134f417eE1263a9085963231"
    const OracleContractV2 = await ethers.getContractFactory("OracleContractV2")
    oracle = OracleContractV2.attach(oracleV2Address)
  });

  describe('Test OracleContractV2', async () => {
    it('get Price for BTC/USD', async () => {
      price = await oracle.getPrice(json.wbtc, zeroAddress, 8)
      console.log(`Precision 8, ${price}`)
      price = await oracle.getPrice(json.wbtc, zeroAddress, 0)
      console.log(`Precision 0, ${price}`)
      price = await oracle.getPrice(json.wbtc, zeroAddress, 1)
      console.log(`Precision 1, ${price}`)
      price = await oracle.getPrice(json.wbtc, zeroAddress, 20)
      console.log(`Precision 20, ${price}`)
    });
    it('get Price of ETH/USD', async () => {
      price = await oracle.getPrice(json.weth, zeroAddress, 8)
      console.log(`Precision 8, ${price}`)
      price = await oracle.getPrice(json.weth, zeroAddress, 0)
      console.log(`Precision 0, ${price}`)
      price = await oracle.getPrice(json.weth, zeroAddress, 1)
      console.log(`Precision 1, ${price}`)
      price = await oracle.getPrice(json.weth, zeroAddress, 20)
      console.log(`Precision 20, ${price}`)
    });
    it('get Price of ETH/BTC', async () => {
      price = await oracle.getPrice(json.weth, json.wbtc, 8)
      console.log(`Precision 8, ${price}`)
      price = await oracle.getPrice(json.weth, json.wbtc, 0)
      console.log(`Precision 0, ${price}`)
      price = await oracle.getPrice(json.weth, json.wbtc, 1)
      console.log(`Precision 1, ${price}`)
      price = await oracle.getPrice(json.weth, json.wbtc, 20)
      console.log(`Precision 20, ${price}`)
    });
    it('get Price of BTC/ETH', async () => {
      price = await oracle.getPrice(json.wbtc, json.weth, 8)
      console.log(`Precision 8, ${price}`)
      price = await oracle.getPrice(json.wbtc, json.weth, 0)
      console.log(`Precision 0, ${price}`)
      price = await oracle.getPrice(json.wbtc, json.weth, 1)
      console.log(`Precision 1, ${price}`)
      price = await oracle.getPrice(json.wbtc, json.weth, 20)
      console.log(`Precision 20, ${price}`)
    });
    it('get Price of MATIC/USD', async () => {
      price = await oracle.getPrice(json.wmatic, zeroAddress, 8)
      console.log(`Precision 8, ${price}`)
      price = await oracle.getPrice(json.wmatic, zeroAddress, 0)
      console.log(`Precision 0, ${price}`)
      price = await oracle.getPrice(json.wmatic, zeroAddress, 1)
      console.log(`Precision 1, ${price}`)
      price = await oracle.getPrice(json.wmatic, zeroAddress, 20)
      console.log(`Precision 20, ${price}`)
    });
    it('get Price of USDC/USD', async () => {
      price = await oracle.getPrice(json.usdc, zeroAddress, 8)
      console.log(`Precision 8, ${price}`)
      price = await oracle.getPrice(json.usdc, zeroAddress, 0)
      console.log(`Precision 0, ${price}`)
      price = await oracle.getPrice(json.usdc, zeroAddress, 1)
      console.log(`Precision 1, ${price}`)
      price = await oracle.getPrice(json.usdc, zeroAddress, 20)
      console.log(`Precision 20, ${price}`)
    });
    it('get Price of USDT/USD', async () => {
      price = await oracle.getPrice(json.usdt, zeroAddress, 8)
      console.log(`Precision 8, ${price}`)
      price = await oracle.getPrice(json.usdt, zeroAddress, 0)
      console.log(`Precision 0, ${price}`)
      price = await oracle.getPrice(json.usdt, zeroAddress, 1)
      console.log(`Precision 1, ${price}`)
      price = await oracle.getPrice(json.usdt, zeroAddress, 20)
      console.log(`Precision 20, ${price}`)
    });
    it('get Price of DAI/USD', async () => {
      price = await oracle.getPrice(json.dai, zeroAddress, 8)
      console.log(`Precision 8, ${price}`)
      price = await oracle.getPrice(json.dai, zeroAddress, 0)
      console.log(`Precision 0, ${price}`)
      price = await oracle.getPrice(json.dai, zeroAddress, 1)
      console.log(`Precision 1, ${price}`)
      price = await oracle.getPrice(json.dai, zeroAddress, 20)
      console.log(`Precision 20, ${price}`)
    });
    it('get Price of BUSD/USD', async () => {
      price = await oracle.getPrice(json.busd, zeroAddress, 8)
      console.log(`Precision 8, ${price}`)
      price = await oracle.getPrice(json.busd, zeroAddress, 0)
      console.log(`Precision 0, ${price}`)
      price = await oracle.getPrice(json.busd, zeroAddress, 1)
      console.log(`Precision 1, ${price}`)
      price = await oracle.getPrice(json.busd, zeroAddress, 20)
      console.log(`Precision 20, ${price}`)
    });
    it('get Price of tusd/USD', async () => {
      price = await oracle.getPrice(json.tusd, zeroAddress, 8)
      console.log(`Precision 8, ${price}`)
      price = await oracle.getPrice(json.tusd, zeroAddress, 0)
      console.log(`Precision 0, ${price}`)
      price = await oracle.getPrice(json.tusd, zeroAddress, 1)
      console.log(`Precision 1, ${price}`)
      price = await oracle.getPrice(json.tusd, zeroAddress, 20)
      console.log(`Precision 20, ${price}`)
    });
    it('get Price of usdd/USD', async () => {
      price = await oracle.getPrice(json.usdd, zeroAddress, 8)
      console.log(`Precision 8, ${price}`)
      price = await oracle.getPrice(json.usdd, zeroAddress, 0)
      console.log(`Precision 0, ${price}`)
      price = await oracle.getPrice(json.usdd, zeroAddress, 1)
      console.log(`Precision 1, ${price}`)
      price = await oracle.getPrice(json.usdd, zeroAddress, 20)
      console.log(`Precision 20, ${price}`)
    });
    it('get Price of cusd/USD', async () => {
      price = await oracle.getPrice(json.cusd, zeroAddress, 8)
      console.log(`Precision 8, ${price}`)
      price = await oracle.getPrice(json.cusd, zeroAddress, 0)
      console.log(`Precision 0, ${price}`)
      price = await oracle.getPrice(json.cusd, zeroAddress, 1)
      console.log(`Precision 1, ${price}`)
      price = await oracle.getPrice(json.cusd, zeroAddress, 20)
      console.log(`Precision 20, ${price}`)
    });
  });
});

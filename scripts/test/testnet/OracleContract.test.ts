import {expect} from 'chai';
import {ethers} from 'hardhat';
import {SignerWithAddress} from '@nomiclabs/hardhat-ethers/signers';
import { BigNumber, Contract } from 'ethers';
import fs from 'fs'

describe('OracleContract Mumbai Testnet Test', () => {
  let owner:SignerWithAddress
  let oracle:Contract
  let price:BigNumber
  const json = JSON.parse(fs.readFileSync('deployMocks.json', 'utf-8'))
  const zeroAddress = ethers.constants.AddressZero

  before(async () => {
    [owner] = await ethers.getSigners()
    const balance = await ethers.provider.getBalance(owner.address)
    console.log({balance})

    const oracleAddress = "0x3580285E0326046406d62B9bF792Abd89b7a3F64"
    const OracleContract = await ethers.getContractFactory("OracleContract")
    oracle = OracleContract.attach(oracleAddress)
  });

  describe('Test OracleContract', async () => {
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
  });
});

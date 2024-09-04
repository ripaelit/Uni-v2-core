import {expect} from 'chai';
import {ethers} from 'hardhat';
import {SignerWithAddress} from '@nomiclabs/hardhat-ethers/signers';
import {MockAggregator, MockToken, MockWETH, OracleContract} from '../../typechain';
import { deployOracle, deployMockToken, deployMockWETH, deployMockAggregator, configOracle, configOracleWithArgs } from '../utils/deployUtils';
import { BigNumber } from 'ethers';

describe('OracleContract', () => {
  let owner: SignerWithAddress;
  let oracle: OracleContract;
  let wbtc: MockToken;
  let weth: MockToken;
  let wmatic: MockWETH;
  let usdt: MockToken;
  let usdc: MockToken;
  let aggregator_BTC_USD: MockAggregator;
  let aggregator_ETH_USD: MockAggregator;
  let aggregator_MATIC_USD: MockAggregator;
  let aggregator_USDT_USD: MockAggregator;
  let aggregator_USDC_USD: MockAggregator;
  let price:BigNumber
  const zeroAddress = ethers.constants.AddressZero

  beforeEach(async () => {
    [owner] = await ethers.getSigners()
    
    oracle = await deployOracle()
    wbtc = await deployMockToken('WBTC', 'WBTC', 8)
    weth = await deployMockToken('WETH', 'WETH', 18)
    wmatic = await deployMockWETH()
    usdt = await deployMockToken('USDT', 'USDT', 6)
    usdc = await deployMockToken('USDC', 'USDC', 6)
    aggregator_BTC_USD = await deployMockAggregator('BTC-USD', 8, 3000000000000)
    aggregator_ETH_USD = await deployMockAggregator('ETH-USD', 8, 180000000000)
    aggregator_MATIC_USD = await deployMockAggregator('MATIC-USD', 8, 60000000)
    aggregator_USDT_USD = await deployMockAggregator('USDT-USD', 8, 100000000)
    aggregator_USDC_USD = await deployMockAggregator('USDC-USD', 8, 98000000)
    const aggregators:string[][] = []
    aggregators.push([wbtc.address, zeroAddress, aggregator_BTC_USD.address])
    aggregators.push([weth.address, zeroAddress, aggregator_ETH_USD.address])
    aggregators.push([wmatic.address, zeroAddress, aggregator_MATIC_USD.address])
    aggregators.push([usdt.address, zeroAddress, aggregator_USDT_USD.address])
    aggregators.push([usdc.address, zeroAddress, aggregator_USDC_USD.address])
    await configOracleWithArgs(oracle.address, aggregators)
  });

  describe('Test OracleContract', async () => {
    it('get Price for BTC/USD', async () => {
      price = await oracle.getPrice(wbtc.address, zeroAddress, 8)
      console.log(`Precision 8, ${price}`)
      price = await oracle.getPrice(wbtc.address, zeroAddress, 0)
      console.log(`Precision 0, ${price}`)
      price = await oracle.getPrice(wbtc.address, zeroAddress, 1)
      console.log(`Precision 1, ${price}`)
      price = await oracle.getPrice(wbtc.address, zeroAddress, 20)
      console.log(`Precision 20, ${price}`)
    });
    it('get Price of ETH/USD', async () => {
      price = await oracle.getPrice(weth.address, zeroAddress, 8)
      console.log(`Precision 8, ${price}`)
      price = await oracle.getPrice(weth.address, zeroAddress, 0)
      console.log(`Precision 0, ${price}`)
      price = await oracle.getPrice(weth.address, zeroAddress, 1)
      console.log(`Precision 1, ${price}`)
      price = await oracle.getPrice(weth.address, zeroAddress, 20)
      console.log(`Precision 20, ${price}`)
    });
    it('get Price of ETH/BTC', async () => {
      price = await oracle.getPrice(weth.address, wbtc.address, 8)
      console.log(`Precision 8, ${price}`)
      price = await oracle.getPrice(weth.address, wbtc.address, 0)
      console.log(`Precision 0, ${price}`)
      price = await oracle.getPrice(weth.address, wbtc.address, 1)
      console.log(`Precision 1, ${price}`)
      price = await oracle.getPrice(weth.address, wbtc.address, 20)
      console.log(`Precision 20, ${price}`)
    });
    it('get Price of BTC/ETH', async () => {
      price = await oracle.getPrice(wbtc.address, weth.address, 8)
      console.log(`Precision 8, ${price}`)
      price = await oracle.getPrice(wbtc.address, weth.address, 0)
      console.log(`Precision 0, ${price}`)
      price = await oracle.getPrice(wbtc.address, weth.address, 1)
      console.log(`Precision 1, ${price}`)
      price = await oracle.getPrice(wbtc.address, weth.address, 20)
      console.log(`Precision 20, ${price}`)
    });
    it('get Price for BTC/USDT', async () => {
      price = await oracle.getPrice(wbtc.address, usdt.address, 8)
      console.log(`Precision 8, ${price}`)
      price = await oracle.getPrice(wbtc.address, usdt.address, 0)
      console.log(`Precision 0, ${price}`)
      price = await oracle.getPrice(wbtc.address, usdt.address, 1)
      console.log(`Precision 1, ${price}`)
      price = await oracle.getPrice(wbtc.address, usdt.address, 20)
      console.log(`Precision 20, ${price}`)
    });
    it('get Price for USDT/BTC', async () => {
      price = await oracle.getPrice(usdt.address, wbtc.address, 8)
      console.log(`Precision 8, ${price}`)
      price = await oracle.getPrice(usdt.address, wbtc.address, 0)
      console.log(`Precision 0, ${price}`)
      price = await oracle.getPrice(usdt.address, wbtc.address, 1)
      console.log(`Precision 1, ${price}`)
      price = await oracle.getPrice(usdt.address, wbtc.address, 20)
      console.log(`Precision 20, ${price}`)
    });
  });
});

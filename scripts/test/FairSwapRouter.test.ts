import {expect} from 'chai';
import {ethers} from 'hardhat';
import {SignerWithAddress} from '@nomiclabs/hardhat-ethers/signers';
import {FairSwapFactory, FairSwapRouter, MockAggregator, MockToken, MockWETH} from '../../typechain';
import {addLiquidity, swapExactTokensForTokens, swapTokensForExactTokens, addLiquidityETH, swapExactETHForTokens, swapETHForExactTokens, swapExactTokensForETH, swapTokensForExactETH, removeLiquidity} from '../utils/testUtils';
import { deployFactory, deployOracle, deploySecret, deployMockToken, deployMockWETH, deployMockAggregator } from '../utils/deployUtils';

describe('FairSwapRouter', () => {
  let owner: SignerWithAddress;
  let router: FairSwapRouter;
  let factory: FairSwapFactory;
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
  const zeroAddress = ethers.constants.AddressZero;
  const oraclePriceBTC = 3000000000000;
  const oraclePriceETH = 180000000000;
  const oraclePriceMATIC = 60000000;
  const oraclePriceUSDT = 100000000;
  const oraclePriceUSDC = 98000000;

  beforeEach(async () => {
    [owner] = await ethers.getSigners()
    
    const oracle = await deployOracle()
    const secret = await deploySecret()
    factory = await deployFactory()
    await factory.setOracle(oracle.address)
    await factory.setSecret(secret.address)
    await factory.setFeeTo(owner.address)
    wbtc = await deployMockToken('WBTC', 'WBTC', 8)
    weth = await deployMockToken('WETH', 'WETH', 18)
    wmatic = await deployMockWETH()
    usdt = await deployMockToken('USDT', 'USDT', 6)
    usdc = await deployMockToken('USDC', 'USDC', 6)

    const FairSwapRouter = await ethers.getContractFactory('FairSwapRouter')
    router = await FairSwapRouter.deploy(
      factory.address,
      wmatic.address
    )
    await router.deployed()
    console.log(`\FairSwapRouter is deployed at ${router.address}`)

    aggregator_BTC_USD = await deployMockAggregator('BTC-USD', 8, oraclePriceBTC)
    aggregator_ETH_USD = await deployMockAggregator('ETH-USD', 8, oraclePriceETH)
    aggregator_MATIC_USD = await deployMockAggregator('MATIC-USD', 8, oraclePriceMATIC)
    aggregator_USDT_USD = await deployMockAggregator('USDT-USD', 8, oraclePriceUSDT)
    aggregator_USDC_USD = await deployMockAggregator('USDC-USD', 8, oraclePriceUSDC)
    let priceFeeds:string[][] = [];
    priceFeeds.push([wbtc.address, zeroAddress, aggregator_BTC_USD.address])
    priceFeeds.push([weth.address, zeroAddress, aggregator_ETH_USD.address])
    priceFeeds.push([wmatic.address, zeroAddress, aggregator_MATIC_USD.address])
    priceFeeds.push([usdt.address, zeroAddress, aggregator_USDT_USD.address])
    priceFeeds.push([usdc.address, zeroAddress, aggregator_USDC_USD.address])
    for (let priceFeed of priceFeeds) {
      await oracle.setAggregator(priceFeed[0], priceFeed[1], priceFeed[2])
    }
  });

  describe('Test FairSwapRouter', async () => {
    it('addLiquidity', async () => {
      let amountUSDT = ethers.utils.parseUnits("10", 6);
      let amountUSDC = ethers.utils.parseUnits("20", 6);
      await addLiquidity(owner, router, usdt, amountUSDT, usdc, amountUSDC);
      amountUSDT = ethers.utils.parseUnits("50", 6);
      amountUSDC = ethers.utils.parseUnits("40", 6);
      await addLiquidity(owner, router, usdt, amountUSDT, usdc, amountUSDC);
    });
    it('addLiquidityETH', async () => {
      const amountUSDT = ethers.utils.parseUnits("1200", 6);
      const amountMATIC = ethers.utils.parseEther("1000");
      await addLiquidityETH(owner, router, usdt, amountUSDT, amountMATIC);
    });
    it('removeLiquidity', async () => {
      const MINIMUM_LIQUIDITY = 1000;
      let amountUSDT = ethers.utils.parseUnits("10", 6);
      let amountUSDC = ethers.utils.parseUnits("20", 6);
      await addLiquidity(owner, router, usdt, amountUSDT, usdc, amountUSDC);
      let amountUSDTAdded;
      let amountUSDCAdded;
      let amountUSDCOptimal = amountUSDT.mul(oraclePriceUSDT).div(oraclePriceUSDC);
      if (!amountUSDCOptimal.gt(amountUSDC)) {
        amountUSDTAdded = amountUSDT;
        amountUSDCAdded = amountUSDCOptimal;
      } else {
        let amountUSDTOptimal = amountUSDC.mul(oraclePriceUSDC).div(oraclePriceUSDT);
        if (!amountUSDTOptimal.gt(amountUSDT)) {
          amountUSDTAdded = amountUSDTOptimal;
          amountUSDCAdded = amountUSDC;
        } else {
          throw new Error("Error!!!");
        }
      }
      let liquidity = Math.floor(Math.sqrt(amountUSDTAdded.mul(amountUSDCAdded).toNumber())) - MINIMUM_LIQUIDITY;
      await removeLiquidity(owner, router, factory, usdt, usdc, liquidity);
    });
    it('swapExactTokensForTokens', async () => {
      // add liquidity
      const amountUSDT = ethers.utils.parseUnits("1000", 6);
      const amountUSDC = ethers.utils.parseUnits("1000", 6);
      await addLiquidity(owner, router, usdt, amountUSDT, usdc, amountUSDC);
      // swap
      const amountInUSDT = ethers.utils.parseUnits("1", 6);
      await swapExactTokensForTokens(owner, router, usdt, amountInUSDT, usdc);
      const amountInUSDC = ethers.utils.parseUnits("1", 6);
      await swapExactTokensForTokens(owner, router, usdc, amountInUSDC, usdt);
    });
    it('swapExactTokensForTokens for WBTC and USDT', async () => {
      // add liquidity
      const amountWBTC = ethers.utils.parseUnits("0.1", 8);
      const amountUSDT = ethers.utils.parseUnits("3000", 6);
      await addLiquidity(owner, router, wbtc, amountWBTC, usdt, amountUSDT);
      // swap
      const amountInWBTC = ethers.utils.parseUnits("0.0001", 8);
      await swapExactTokensForTokens(owner, router, wbtc, amountInWBTC, usdt);
      const amountInUSDT = ethers.utils.parseUnits("3", 6);
      await swapExactTokensForTokens(owner, router, usdt, amountInUSDT, wbtc);
    });
    it('swapTokensForExactTokens', async () => {
      // add liquidity
      const amountUSDT = ethers.utils.parseUnits("1000", 6);
      const amountUSDC = ethers.utils.parseUnits("1000", 6);
      await addLiquidity(owner, router, usdt, amountUSDT, usdc, amountUSDC);
      // swap
      const amountOut = ethers.utils.parseUnits("1", 6);
      await swapTokensForExactTokens(owner, router, usdt, usdc, amountOut);
    });
    it('swapExactETHForTokens', async () => {
      // add liquidityETH
      const amountMATIC = ethers.utils.parseEther("1000");
      const amountUSDT = ethers.utils.parseUnits("600", 6);
      await addLiquidityETH(owner, router, usdt, amountUSDT, amountMATIC);
      // swap
      const amountIn = ethers.utils.parseEther("1");
      await swapExactETHForTokens(owner, router, wmatic.address, amountIn, usdt);

    });
    it('swapETHForExactTokens', async () => {
      // add liquidityETH
      const amountMATIC = ethers.utils.parseEther("1000");
      const amountUSDT = ethers.utils.parseUnits("600", 6);
      await addLiquidityETH(owner, router, usdt, amountUSDT, amountMATIC);
      // swap
      const amountOut = ethers.utils.parseUnits("6", 6);
      await swapETHForExactTokens(owner, router, wmatic.address, usdt, amountOut);
    });
    it('swapExactTokensForETH', async () => {
      // add liquidityETH
      const amountMATIC = ethers.utils.parseEther("1000");
      const amountUSDT = ethers.utils.parseUnits("600", 6);
      await addLiquidityETH(owner, router, usdt, amountUSDT, amountMATIC);
      // swap
      const amountIn = ethers.utils.parseUnits("6", 6);
      await swapExactTokensForETH(owner, router, usdt, amountIn, wmatic.address);
    });
    it('swapTokensForExactETH', async () => {
      // add liquidityETH
      const amountMATIC = ethers.utils.parseEther("1000");
      const amountUSDT = ethers.utils.parseUnits("600", 6);
      await addLiquidityETH(owner, router, usdt, amountUSDT, amountMATIC);
      // swap
      const amountOut = ethers.utils.parseEther("1");
      await swapTokensForExactETH(owner, router, usdt, wmatic.address, amountOut);
    });
  });
});

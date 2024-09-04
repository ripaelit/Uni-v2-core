import {expect} from 'chai';
import {ethers} from 'hardhat';
import {SignerWithAddress} from '@nomiclabs/hardhat-ethers/signers';
import {SecretContract} from '../../typechain';
import {deploySecret} from '../utils/deployUtils';

describe('SecretContract', () => {
  let owner: SignerWithAddress;
  let secret: SecretContract;

  beforeEach(async () => {
    [owner] = await ethers.getSigners()
    
    secret = await deploySecret()
  });

  describe('Test SecretContract', async () => {
    it('get amountOut wbtc/usdt', async () => {
      const amountInWBTC = ethers.utils.parseUnits("1", 18);
      const dataWBTC2USDT = {
        tokenX: "0x207806509139f2d140E7F78dc73122C649dF6054", // wbtc
        tokenY: "0x79F2c57654fEa4C01fe04Cce3C70be880ede5F3F", // usdt
        tokenIn: "0x207806509139f2d140E7F78dc73122C649dF6054",  // usdt
        liquidityPool: ethers.constants.AddressZero,
        reserveX: 0,
        reserveY: 0,
        priceDecimals: 8,
        oraclePrice: 3000000000000, // wbtc/usdt price
        lastInvariant: 0,
        leverageDecimals: 3,
        spreadFactor: 10**3,
        leveragePercent: 0,
        tokenXdecimals: 18, // wbtc decimals
        tokenYdecimals: 6,  // usdt decimals
        scaleDecimals: 24,
        balanceX: 0,
        balanceY: 0,
        amountXIn: 0,
        amountXOut: 0,
        amountYIn: 0,
        amountYOut: 0
      }
      const amountOutUSDT = await secret.getAmountOut(amountInWBTC, dataWBTC2USDT);
      console.log("amountOutUSDT", amountOutUSDT.toString())

      const amountInUSDT = ethers.utils.parseUnits("1", 6);
      const dataUSDT2WBTC = {
        tokenX: "0x207806509139f2d140E7F78dc73122C649dF6054", // wbtc
        tokenY: "0x79F2c57654fEa4C01fe04Cce3C70be880ede5F3F", // usdt
        tokenIn: "0x79F2c57654fEa4C01fe04Cce3C70be880ede5F3F",  // usdt
        liquidityPool: ethers.constants.AddressZero,
        reserveX: 0,
        reserveY: 0,
        priceDecimals: 8,
        oraclePrice: 3000000000000, // wbtc/usdt price
        lastInvariant: 0,
        leverageDecimals: 3,
        spreadFactor: 10**3,
        leveragePercent: 0,
        tokenXdecimals: 18, // wbtc decimals
        tokenYdecimals: 6,  // usdt decimals
        scaleDecimals: 24,
        balanceX: 0,
        balanceY: 0,
        amountXIn: 0,
        amountXOut: 0,
        amountYIn: 0,
        amountYOut: 0
      }
      const amountOutWBTC = await secret.getAmountOut(amountInUSDT, dataUSDT2WBTC);
      console.log("amountOutWBTC", amountOutWBTC.toString())
    })
  });
});

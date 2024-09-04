import {expect} from 'chai';
import {ethers} from 'hardhat';
import {SignerWithAddress} from '@nomiclabs/hardhat-ethers/signers';
import {ERC20, FairSwapFactory, FairSwapRouter} from '../../../typechain';
import {addLiquidity, swapExactTokensForTokens, swapTokensForExactTokens, addLiquidityETH, swapExactETHForTokens, swapETHForExactTokens, swapExactTokensForETH, swapTokensForExactETH} from '../../utils/testUtils';
import {mumbaiData} from '../../constants';
import fs from 'fs';

describe('FairSwapRouter Mumbai Testnet', () => {
  let owner: SignerWithAddress;
  let router: FairSwapRouter;
  let factory: FairSwapFactory;
  let usdt: ERC20;
  let usdc: ERC20;

  before(async () => {
    [owner] = await ethers.getSigners()
    const balance = await ethers.provider.getBalance(owner.address)
    console.log({balance})
    const network = await ethers.provider.getNetwork()

    let json = JSON.parse(fs.readFileSync(`deployAll.${network.name}.json`, 'utf-8'))
    const FairSwapRouter = await ethers.getContractFactory("FairSwapRouter")
    router = FairSwapRouter.attach(json.router)
    const FairSwapFactory = await ethers.getContractFactory("FairSwapFactory")
    factory = FairSwapFactory.attach(json.factory)

    json = JSON.parse(fs.readFileSync('deployMocks.json', 'utf-8'))
    const ERC20 = await ethers.getContractFactory("ERC20")
    usdt = ERC20.attach(json.usdt)
    usdc = ERC20.attach(json.usdc)
  });

  describe('Test FairSwapRouter on Mumbai', async () => {
    it('addLiquidity', async () => {
      const amountUSDT = ethers.utils.parseUnits("10000", await usdt.decimals())
      const amountUSDC = ethers.utils.parseUnits("10000", await usdc.decimals())
      const amountsQuote = await router.quoteAddLiquidity(usdt.address, usdc.address, amountUSDT, amountUSDC, 0, 0)
      const pairAddress = await factory.getPair(usdt.address, usdc.address)
      const FairSwapPair = await ethers.getContractFactory("FairSwapPair")
      const pair = FairSwapPair.attach(pairAddress)
      const reserves = await pair.getReserves()
      const totalSupply = await pair.totalSupply()
      const liquidity = await pair.quoteMintLiquidity(amountUSDT, amountUSDC, reserves[0], reserves[1], totalSupply)
      await expect(addLiquidity(owner, router, usdt, amountUSDT, usdc, amountUSDC)).to.emit(router, "AddLiquidity").withArgs(amountsQuote[0], amountsQuote[1], liquidity)
    });
    it('addLiquidityETH', async () => {
      const amountETH = ethers.utils.parseEther("10");
      const amountUSDT = ethers.utils.parseUnits("18000", 6);
      await addLiquidityETH(owner, router, usdt, amountUSDT, amountETH);
    });
    it('swapExactTokensForTokens', async () => {
      const amountIn = ethers.utils.parseUnits("1", 6);
      await swapExactTokensForTokens(owner, router, usdt, amountIn, usdc);
    });
    it('swapTokensForExactTokens', async () => {
      const amountOut = ethers.utils.parseUnits("1", 6);
      await swapTokensForExactTokens(owner, router, usdt, usdc, amountOut);
    });
    it('swapExactETHForTokens', async () => {
      const amountIn = ethers.utils.parseEther("0.01");
      await swapExactETHForTokens(owner, router, mumbaiData.wmatic, amountIn, usdt);
    });
    it('swapETHForExactTokens', async () => {
      const amountOut = ethers.utils.parseUnits("10", 6);
      await swapETHForExactTokens(owner, router, mumbaiData.wmatic, usdt, amountOut);
    });
    it('swapExactTokensForETH', async () => {
      const amountIn = ethers.utils.parseUnits("10", 6);
      await swapExactTokensForETH(owner, router, usdt, amountIn, mumbaiData.wmatic);
    });
    it('swapTokensForExactETH', async () => {
      const amountOut = ethers.utils.parseEther("0.01");
      await swapTokensForExactETH(owner, router, usdt, mumbaiData.wmatic, amountOut);
    });
  });
});

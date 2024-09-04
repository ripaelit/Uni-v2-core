import {expect} from 'chai';
import {ethers} from 'hardhat';
import {SignerWithAddress} from '@nomiclabs/hardhat-ethers/signers';
import {ERC20, FairSwapRouter} from '../../../typechain';
import {addLiquidity, swapExactTokensForTokens, swapTokensForExactTokens, addLiquidityETH, swapExactETHForTokens, swapETHForExactTokens, swapExactTokensForETH, swapTokensForExactETH, logEstimatedSwap, logEstimatedUniV2Swap} from '../../utils/testUtils';
import { polygonData } from '../../constants';
import { BigNumber, ContractInterface } from 'ethers';
import fs from 'fs';

describe('FairSwapRouter Polygon', () => {
  let owner: SignerWithAddress;
  let router: FairSwapRouter;
  let fwbtc: ERC20;
  let fweth: ERC20;
  let fusdt: ERC20;
  let fusdc: ERC20;
  let fdai: ERC20;
  let fsol: ERC20;
  let fdoge: ERC20;
  let fxau: ERC20;
  let usdt: ERC20;
  let usdc: ERC20;
  let decimalsFWBTC:number;
  let decimalsFWETH:number;
  let decimalsFUSDT:number;
  let decimalsFUSDC:number;
  let decimalsFDAI:number;
  let decimalsFSOL:number;
  let decimalsFDOGE:number;
  let decimalsFXAU:number;
  let decimalsUSDT:number;
  let decimalsUSDC:number;
  let UniswapV2Router02ABI:ContractInterface;

  before(async () => {
    [owner] = await ethers.getSigners()
    const balance = await ethers.provider.getBalance(owner.address)
    console.log("before", owner.address, {balance})
    const network = await ethers.provider.getNetwork()

    let json = JSON.parse(fs.readFileSync(`deployAll.${network.name}.json`, 'utf-8'))
    const FairSwapRouter = await ethers.getContractFactory("FairSwapRouter")
    router = FairSwapRouter.attach(json.router)

    const ERC20 = await ethers.getContractFactory("ERC20")
    fwbtc = ERC20.attach(polygonData.fwbtc)
    fweth = ERC20.attach(polygonData.fweth)
    fusdt = ERC20.attach(polygonData.fusdt)
    fusdc = ERC20.attach(polygonData.fusdc)
    fdai = ERC20.attach(polygonData.fdai)
    fsol = ERC20.attach(polygonData.fsol)
    fdoge = ERC20.attach(polygonData.fdoge)
    fxau = ERC20.attach(polygonData.fxau)
    usdt = ERC20.attach(polygonData.usdt)
    usdc = ERC20.attach(polygonData.usdc)

    decimalsFWBTC = await fwbtc.decimals()
    decimalsFWETH = await fweth.decimals()
    decimalsFUSDT = await fusdt.decimals()
    decimalsFUSDC = await fusdc.decimals()
    decimalsFDAI = await fdai.decimals()
    decimalsFSOL = await fsol.decimals()
    decimalsFDOGE = await fdoge.decimals()
    decimalsFXAU = await fxau.decimals()
    decimalsUSDT = await usdt.decimals()
    decimalsUSDC = await usdc.decimals()

    json = JSON.parse(fs.readFileSync(`UniswapV2Router02.json`, 'utf-8'))
    UniswapV2Router02ABI = json.abi
  });

  after(async () => {
    [owner] = await ethers.getSigners()
    const balance = await ethers.provider.getBalance(owner.address)
    console.log("after", owner.address, {balance})
  });

  describe('Test FairSwapRouter on Polygon', async () => {
    it.skip('addLiquidity', async () => {
      let amountFWBTC = ethers.utils.parseUnits("10000", decimalsFWBTC)
      let amountFWETH = ethers.utils.parseUnits("10000", decimalsFWETH)
      await addLiquidity(owner, router, fwbtc, amountFWBTC, fweth, amountFWETH)

      amountFWETH = ethers.utils.parseUnits("1000", decimalsFWETH)
      let amountFUSDT = ethers.utils.parseUnits("100000", decimalsFUSDT)
      await addLiquidity(owner, router, fweth, amountFWETH, fusdt, amountFUSDT)
      
      amountFUSDT = ethers.utils.parseUnits("100000", decimalsFUSDT)
      let amountFUSDC = ethers.utils.parseUnits("100000", decimalsFUSDC)
      await addLiquidity(owner, router, fusdt, amountFUSDT, fusdc, amountFUSDC)

      amountFUSDC = ethers.utils.parseUnits("100000", decimalsFUSDC)
      let amountFDAI = ethers.utils.parseUnits("100000", decimalsFDAI)
      await addLiquidity(owner, router, fusdc, amountFUSDC, fdai, amountFDAI)

      amountFDAI = ethers.utils.parseUnits("100000", decimalsFDAI)
      let amountFSOL = ethers.utils.parseUnits("100000", decimalsFSOL)
      await addLiquidity(owner, router, fdai, amountFDAI, fsol, amountFSOL)
      
      amountFSOL = ethers.utils.parseUnits("100000", decimalsFSOL)
      let amountFDOGE = ethers.utils.parseUnits("100000", decimalsFDOGE)
      await addLiquidity(owner, router, fsol, amountFSOL, fdoge, amountFDOGE)

      amountFDOGE = ethers.utils.parseUnits("100000", decimalsFDOGE)
      let amountFXAU = ethers.utils.parseUnits("100000", decimalsFXAU)
      await addLiquidity(owner, router, fdoge, amountFDOGE, fxau, amountFXAU)
    });
    it.skip('addLiquidityETH - FUSDT/ETH', async () => {
      const amountFUSDT = ethers.utils.parseUnits("0.1", decimalsFUSDT);
      const amountETH = ethers.utils.parseEther("0.2");
      await addLiquidityETH(owner, router, fusdt, amountFUSDT, amountETH);
    });
    it('Exact FWBTC -> FWETH', async () => {
      const amountFWBTC = ethers.utils.parseUnits("1", decimalsFWBTC)
      await logEstimatedSwap(router, fwbtc.address, amountFWBTC, fweth.address, BigNumber.from("0"))
      await swapExactTokensForTokens(owner, router, fwbtc, amountFWBTC, fweth)
    });
    it('Exact FWETH -> FWBTC', async () => {
      const amountFWETH = ethers.utils.parseUnits("10", decimalsFWETH)
      await logEstimatedSwap(router, fweth.address, amountFWETH, fwbtc.address, BigNumber.from("0"))
      await swapExactTokensForTokens(owner, router, fweth, amountFWETH, fwbtc)
    });
    it('Exact FWETH -> FUSDT', async () => {
      const amountFWETH = ethers.utils.parseUnits("10", decimalsFWETH)
      await logEstimatedSwap(router, fweth.address, amountFWETH, fusdt.address, BigNumber.from("0"))
      await swapExactTokensForTokens(owner, router, fweth, amountFWETH, fusdt)
    });
    it('Exact FUSDT -> FWETH', async () => {
      const amountFUSDT = ethers.utils.parseUnits("10000", decimalsFUSDT)
      await logEstimatedSwap(router, fusdt.address, amountFUSDT, fweth.address, BigNumber.from("0"))
      await swapExactTokensForTokens(owner, router, fusdt, amountFUSDT, fweth)
    });
    it('Exact FUSDT -> FUSDC', async () => {
      const amountFUSDT = ethers.utils.parseUnits("10000", decimalsFUSDT)
      await logEstimatedSwap(router, fusdt.address, amountFUSDT, fusdc.address, BigNumber.from("0"))
      await swapExactTokensForTokens(owner, router, fusdt, amountFUSDT, fusdc)
    });
    it('Exact FUSDC -> FUSDT', async () => {
      const amountFUSDC = ethers.utils.parseUnits("10000", decimalsFUSDC)
      await logEstimatedSwap(router, fusdc.address, amountFUSDC, fusdt.address, BigNumber.from("0"))
      await swapExactTokensForTokens(owner, router, fusdc, amountFUSDC, fusdt)
    });
    it('FUSDT -> Exact FUSDC', async () => {
      const amountFUSDC = ethers.utils.parseUnits("10000", decimalsFUSDC)
      await logEstimatedSwap(router, fusdt.address, BigNumber.from("0"), fusdc.address, amountFUSDC)
      await swapTokensForExactTokens(owner, router, fusdt, fusdc, amountFUSDC)
    });
    it('Exact ETH -> FUSDT', async () => {
      const amountETH = ethers.utils.parseEther("0.02")
      await logEstimatedSwap(router, polygonData.wmatic, amountETH, fusdt.address, BigNumber.from("0"))
      await swapExactETHForTokens(owner, router, polygonData.wmatic, amountETH, fusdt)
    });
    it('ETH -> Exact FUSDT', async () => {
      const amountFUSDT = ethers.utils.parseUnits("0.01", decimalsFUSDT)
      await logEstimatedSwap(router, polygonData.wmatic, BigNumber.from("0"), fusdt.address, amountFUSDT)
      await swapETHForExactTokens(owner, router, polygonData.wmatic, fusdt, amountFUSDT)
    });
    it('Exact FUSDT -> ETH', async () => {
      const amountFUSDT = ethers.utils.parseUnits("0.01", decimalsFUSDT)
      await logEstimatedSwap(router, fusdt.address, amountFUSDT, polygonData.wmatic, BigNumber.from("0"))
      await swapExactTokensForETH(owner, router, fusdt, amountFUSDT, polygonData.wmatic)
    });
    it('FUSDT -> Exact ETH', async () => {
      const amountETH = ethers.utils.parseEther("0.02")
      await logEstimatedSwap(router, fusdt.address, BigNumber.from("0"), polygonData.wmatic, amountETH)
      await swapTokensForExactETH(owner, router, fusdt, polygonData.wmatic, amountETH)
    });
    // Compare with UniswapV2
    it('Exact USDT -> USDC', async () => {
      const amountUSDT = ethers.utils.parseUnits("1", decimalsUSDT)
      await logEstimatedUniV2Swap(owner, polygonData.uniswapV2Router02, UniswapV2Router02ABI, usdt.address, amountUSDT, usdc.address, BigNumber.from("0"))
      await logEstimatedSwap(router, usdt.address, amountUSDT, usdc.address, BigNumber.from("0"))
      await swapExactTokensForTokens(owner, router, usdt, amountUSDT, usdc)
    });
  });
});

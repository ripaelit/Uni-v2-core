// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "./interfaces/IFairSwapPair.sol";
import "./interfaces/IOracleContract.sol";
import "./interfaces/ISecretContract.sol";
import "./libraries/Math.sol";
import "./libraries/UQ112x112.sol";
import "./interfaces/IFairSwapFactory.sol";
import "./interfaces/IFairSwapCallee.sol";
import "./FairSwapERC20.sol";

contract FairSwapPair is IFairSwapPair, FairSwapERC20 {
    using UQ112x112 for uint224;

    uint public constant MINIMUM_LIQUIDITY = 10**3;
    bytes4 private constant SELECTOR = bytes4(keccak256(bytes("transfer(address,uint256)")));

    address public factory;
    address public token0;
    address public token1;
    uint8 public token0Decimals;
    uint8 public token1Decimals;
    uint256 public temporalK; // variable for future use
    uint256 public wow; // variable for future use
    uint256 public leveragePercent; // variable for leverage param

    uint112 private reserve0;           // uses single storage slot, accessible via getReserves
    uint112 private reserve1;           // uses single storage slot, accessible via getReserves
    uint32  private blockTimestampLast; // uses single storage slot, accessible via getReserves

    uint public price0CumulativeLast;
    uint public price1CumulativeLast;
    uint public kLast; // reserve0 * reserve1, as of immediately after the most recent liquidity event

    uint private unlocked = 1;
    modifier lock() {
        require(unlocked == 1, "FairSwap: LOCKED");
        unlocked = 0;
        _;
        unlocked = 1;
    }

    function getReserves() public view returns (uint112 _reserve0, uint112 _reserve1, uint32 _blockTimestampLast) {
        _reserve0 = reserve0;
        _reserve1 = reserve1;
        _blockTimestampLast = blockTimestampLast;
    }

    function _safeTransfer(address token, address to, uint value) private {
        (bool success, bytes memory data) = token.call(abi.encodeWithSelector(SELECTOR, to, value));
        require(success && (data.length == 0 || abi.decode(data, (bool))), "FairSwap: TRANSFER_FAILED");
    }

    constructor() {
        factory = msg.sender;
    }

    // called once by the factory at time of deployment
    function initialize(address _token0, address _token1) external {
        require(msg.sender == factory, "FairSwap: FORBIDDEN"); // sufficient check
        token0 = _token0;
        token1 = _token1;
        token0Decimals = IERC20Metadata(token0).decimals();
        token1Decimals = IERC20Metadata(token1).decimals();
        leveragePercent = 0;
    }

    // update reserves and, on the first call per block, price accumulators
    function _update(uint balance0, uint balance1, uint112 _reserve0, uint112 _reserve1) private {
        require(balance0 <= type(uint112).max && balance1 <= type(uint112).max, "FairSwap: OVERFLOW");
        uint32 blockTimestamp = uint32(block.timestamp % 2**32);
        uint32 timeElapsed = blockTimestamp - blockTimestampLast; // overflow is desired
        if (timeElapsed > 0 && _reserve0 != 0 && _reserve1 != 0) {
            // * never overflows, and + overflow is desired
            price0CumulativeLast += uint(UQ112x112.encode(_reserve1).uqdiv(_reserve0)) * timeElapsed;
            price1CumulativeLast += uint(UQ112x112.encode(_reserve0).uqdiv(_reserve1)) * timeElapsed;
        }
        reserve0 = uint112(balance0);
        reserve1 = uint112(balance1);
        blockTimestampLast = blockTimestamp;
        emit Sync(reserve0, reserve1);
    }
    function _updateTemporal(uint balance0, uint balance1, uint _temporalK, uint _wow) private {
        require(balance0 <= type(uint112).max && balance1 <= type(uint112).max, "FairSwapPair: OVERFLOW");
        if (_temporalK == 0) {
            temporalK = balance0 * balance1;
        } else {
            temporalK = _temporalK;
        }
        if (_wow != 0) wow = _wow;
    }
    function _getLastK() private view returns (uint256) {
        require(kLast != 0 || temporalK != 0 ,"FairSwap: LastK missing");
        return temporalK == 0 ? kLast : temporalK;
    }
    function _getSecret() private view returns (address) {
        address _secret = IFairSwapFactory(factory).secret();
        require(_secret != address(0) ,"FairSwapPair: AMM service Secret missing");
        return _secret;
    }
    function _getOracle() private view returns (address) {
        address _oracle = IFairSwapFactory(factory).oracle();
        require(_oracle != address(0) ,"FairSwapPair: AMM service Oracle missing");
        return _oracle;
    }
    
    // if fee is on, mint liquidity equivalent to 1/6th of the growth in sqrt(k)
    function _mintFee(uint112 _reserve0, uint112 _reserve1) private returns (bool feeOn) {
        address feeTo = IFairSwapFactory(factory).feeTo();
        feeOn = feeTo != address(0);
        uint _kLast = kLast; // gas savings
        if (feeOn) {
            if (_kLast != 0) {
                uint rootK = Math.sqrt(uint(_reserve0) * _reserve1);
                uint rootKLast = Math.sqrt(_kLast);
                if (rootK > rootKLast) {
                    uint numerator = totalSupply * (rootK - rootKLast);
                    uint denominator = rootK * 5 + rootKLast;
                    uint liquidity = numerator / denominator;
                    if (liquidity > 0) _mint(feeTo, liquidity);
                }
            }
        } else if (_kLast != 0) {
            kLast = 0;
        }
    }

    function quoteMintLiquidity(
        uint _amount0, 
        uint _amount1, 
        uint112 _reserve0, 
        uint112 _reserve1, 
        uint _totalSupply
    ) public pure returns (uint liquidity) {
        if (_totalSupply == 0) {
            liquidity = Math.sqrt(_amount0 * _amount1) - MINIMUM_LIQUIDITY;
        } else {
            liquidity = Math.min(_amount0 * _totalSupply / _reserve0, _amount1 * _totalSupply / _reserve1);
        }
    }

    // this low-level function should be called from a contract which performs important safety checks
    function mint(address to) external lock returns (uint liquidity) {
        (uint112 _reserve0, uint112 _reserve1,) = getReserves(); // gas savings
        uint balance0 = IERC20(token0).balanceOf(address(this));
        uint balance1 = IERC20(token1).balanceOf(address(this));
        uint amount0 = balance0 - _reserve0;
        uint amount1 = balance1 - _reserve1;

        bool feeOn = _mintFee(_reserve0, _reserve1);
        uint _totalSupply = totalSupply; // gas savings, must be defined here since totalSupply can update in _mintFee
        liquidity = quoteMintLiquidity(amount0, amount1, _reserve0, _reserve1, _totalSupply);
        require(liquidity > 0, "FairSwap: INSUFFICIENT_LIQUIDITY_MINTED");
        
        if (_totalSupply == 0) {
           _mint(address(0), MINIMUM_LIQUIDITY); // permanently lock the first MINIMUM_LIQUIDITY tokens
        }
        _mint(to, liquidity);

        _update(balance0, balance1, _reserve0, _reserve1);
        _updateTemporal(balance0, balance1, 0, 0);
        if (feeOn) kLast = uint(reserve0) * reserve1; // reserve0 and reserve1 are up-to-date
        emit Mint(msg.sender, amount0, amount1);
    }

    // this low-level function should be called from a contract which performs important safety checks
    function burn(address to) external lock returns (uint amount0, uint amount1) {
        (uint112 _reserve0, uint112 _reserve1,) = getReserves(); // gas savings
        address _token0 = token0;                                // gas savings
        address _token1 = token1;                                // gas savings
        uint balance0 = IERC20(_token0).balanceOf(address(this));
        uint balance1 = IERC20(_token1).balanceOf(address(this));
        uint liquidity = balanceOf[address(this)];

        bool feeOn = _mintFee(_reserve0, _reserve1);
        uint _totalSupply = totalSupply; // gas savings, must be defined here since totalSupply can update in _mintFee
        amount0 = liquidity * balance0 / _totalSupply; // using balances ensures pro-rata distribution
        amount1 = liquidity * balance1 / _totalSupply; // using balances ensures pro-rata distribution
        require(amount0 > 0 && amount1 > 0, "FairSwap: INSUFFICIENT_LIQUIDITY_BURNED");
        _burn(address(this), liquidity);
        _safeTransfer(_token0, to, amount0);
        _safeTransfer(_token1, to, amount1);
        balance0 = IERC20(_token0).balanceOf(address(this));
        balance1 = IERC20(_token1).balanceOf(address(this));

        _update(balance0, balance1, _reserve0, _reserve1);
        _updateTemporal(balance0, balance1, 0, 0);
        if (feeOn) kLast = uint(reserve0) * reserve1; // reserve0 and reserve1 are up-to-date
        emit Burn(msg.sender, amount0, amount1, to);
    }

    // this low-level function should be called from a contract which performs important safety checks
    function swap(uint amount0Out, uint amount1Out, address to, bytes calldata caldata) external lock {
        require(amount0Out > 0 || amount1Out > 0, "FairSwap: INSUFFICIENT_OUTPUT_AMOUNT");
        (uint112 _reserve0, uint112 _reserve1,) = getReserves(); // gas savings
        require(amount0Out < _reserve0 && amount1Out < _reserve1, "FairSwap: INSUFFICIENT_LIQUIDITY");

        uint balance0;
        uint balance1;
        { // scope for _token{0,1}, avoids stack too deep errors
        address _token0 = token0;
        address _token1 = token1;
        require(to != _token0 && to != _token1, "FairSwap: INVALID_TO");
        if (amount0Out > 0) _safeTransfer(_token0, to, amount0Out); // optimistically transfer tokens
        if (amount1Out > 0) _safeTransfer(_token1, to, amount1Out); // optimistically transfer tokens
        if (caldata.length > 0) IFairSwapCallee(to).fairswapCall(msg.sender, amount0Out, amount1Out, caldata);
        balance0 = IERC20(_token0).balanceOf(address(this));
        balance1 = IERC20(_token1).balanceOf(address(this));
        }
        uint amount0In = balance0 > _reserve0 - amount0Out ? balance0 - (_reserve0 - amount0Out) : 0;
        uint amount1In = balance1 > _reserve1 - amount1Out ? balance1 - (_reserve1 - amount1Out) : 0;
        require(amount0In > 0 || amount1In > 0, "FairSwap: INSUFFICIENT_INPUT_AMOUNT");
        {   // scope for reserve{0,1}Adjusted, avoids stack too deep errors
            uint balance0Adjusted = balance0 * 1000 - amount0In * 3;
            uint balance1Adjusted = balance1 * 1000 - amount1In * 3;
            uint _temporalK;
            uint _wow;
            // require(balance0Adjusted * balance1Adjusted >= uint(_reserve0) * _reserve1 * (1000**2), "FairSwap: K");
            ISecretContract.TokensInputData memory data;
            data.tokenX = token0;
            data.tokenY = token1;
            data.tokenIn = (amount0In > 0 && amount1In > 0) ? address(0) :
                           (amount0In > 0) ? token0 : token1; 
            data.liquidityPool = address(this);
            data.reserveX = reserve0;
            data.reserveY = reserve1;
            data.priceDecimals = 8;
            // we will always need price of tokenX in terms of token Y from the oracle
            data.oraclePrice = IOracleContract(_getOracle()).getPrice(data.tokenX, data.tokenY, uint8(data.priceDecimals));
            data.lastInvariant = _getLastK();
            data.leverageDecimals = 3;
            data.spreadFactor = 10** data.leverageDecimals;
            data.leveragePercent = leveragePercent;
            data.tokenXdecimals = token0Decimals;
            data.tokenYdecimals = token1Decimals;
            data.scaleDecimals = 24;
            data.balanceX = balance0Adjusted; // we are passing  adjusted balance of token0 which excludes pending fees 
            data.balanceY = balance1Adjusted; // we are passing  adjusted balance of token1 which excludes pending fees 
            data.amountXIn = amount0In;
            data.amountXOut = amount0Out;
            data.amountYIn = amount1In;
            data.amountYOut = amount1Out;
            (_temporalK, _wow) = ISecretContract(_getSecret()).validateData(data);
            _updateTemporal(balance0, balance1,_temporalK,_wow);
        }

        _update(balance0, balance1, _reserve0, _reserve1);
        emit Swap(msg.sender, amount0In, amount1In, amount0Out, amount1Out, to);
    }

    // force balances to match reserves
    function skim(address to) external lock {
        address _token0 = token0; // gas savings
        address _token1 = token1; // gas savings
        _safeTransfer(_token0, to, IERC20(_token0).balanceOf(address(this)) - reserve0);
        _safeTransfer(_token1, to, IERC20(_token1).balanceOf(address(this)) - reserve1);
    }

    // force reserves to match balances
    function sync() external lock {
        _update(IERC20(token0).balanceOf(address(this)), IERC20(token1).balanceOf(address(this)), reserve0, reserve1);
    }
    function setLeveragePercent(uint percentValue) external lock {
        require(msg.sender == factory, "FairSwap: FORBIDDEN"); // sufficient check
        require(leveragePercent>=0 || leveragePercent<=500, "FairSwap: Invalid Leverage Percent");
        leveragePercent = percentValue;
    }
    function getAmountOut(uint amountIn, address tokenIn) external view returns (uint amountOut) {
        require(amountIn > 0, "FairSwapPair: INSUFFICIENT_INPUT_AMOUNT");
        require(tokenIn == token0 || tokenIn == token1, "FairSwapPair: Invalid token");
        amountIn = amountIn*997/1000; //setting default fee 0.3% to amountIn as the same fee is on balanceAdjusted  
        ISecretContract.TokensInputData memory data;
        data.tokenX = token0;
        data.tokenY = token1;
        data.tokenIn = tokenIn;
        data.liquidityPool = address(this);
        data.reserveX = reserve0;
        data.reserveY = reserve1;
        data.priceDecimals = 8;
        data.oraclePrice = IOracleContract(_getOracle()).getPrice(data.tokenX, data.tokenY, uint8(data.priceDecimals));
        data.lastInvariant = _getLastK();
        data.leverageDecimals = 3;
        data.spreadFactor = 10 ** data.leverageDecimals;
        data.leveragePercent = leveragePercent;   
        data.tokenXdecimals = token0Decimals;
        data.tokenYdecimals = token1Decimals;
        data.scaleDecimals = 24;
        // balances are not needed for getAmount Out or getAmount In
        data.balanceX = 0;
        data.balanceY = 0;
        data.amountXIn = 0;
        data.amountXOut = 0;
        data.amountYIn = 0;
        data.amountYOut = 0;

        amountOut = ISecretContract(_getSecret()).getAmountOut(amountIn, data);
    }
    function getAmountIn(uint amountOut, address tokenIn) external view returns (uint amountIn) {
        require(amountOut > 0, "FairSwapPair: INSUFFICIENT_INPUT_AMOUNT");
        require(tokenIn == token0 || tokenIn == token1, "FairSwapPair: Invalid token");
        ISecretContract.TokensInputData memory data;
        data.tokenX = token0;
        data.tokenY = token1;
        data.tokenIn = tokenIn;
        data.liquidityPool = address(this);
        data.reserveX = reserve0;
        data.reserveY = reserve1;
        data.priceDecimals = 8;
        data.oraclePrice = IOracleContract(_getOracle()).getPrice(data.tokenX, data.tokenY, uint8(data.priceDecimals));
        data.lastInvariant = _getLastK();
        data.leverageDecimals = 3;
        data.spreadFactor = 10 ** data.leverageDecimals;
        data.leveragePercent = leveragePercent;    
        data.tokenXdecimals = token0Decimals;
        data.tokenYdecimals = token1Decimals;
        data.scaleDecimals = 24; 
        // balances are not needed for getAmount Out or getAmount In
        data.balanceX = 0;
        data.balanceY = 0;
        data.amountXIn = 0;
        data.amountXOut = 0;
        data.amountYIn = 0;
        data.amountYOut = 0;

        amountIn = ISecretContract(_getSecret()).getAmountIn(amountOut, data); 
        amountIn = amountIn+(amountIn*3/1000); //setting default fee 0.3% to amountIn as the same fee is on balanceAdjusted
    }
}
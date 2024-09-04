// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./interfaces/ISecretContract.sol";

contract SecretContract is ISecretContract {
    function getAmountOut(uint amountIn, TokensInputData memory _data) 
        external 
        pure 
        returns (uint amountOut) 
    {                               
        amountOut=_getAmountOut(amountIn,_data);                                
    }
                       
    function getAmountIn(uint amountOut, TokensInputData memory _data) 
        external 
        pure 
        returns (uint amountIn) 
    {
        amountIn=_getAmountIn(amountOut,_data);                                
    }      

    function _getAmountOut(uint amountIn, TokensInputData memory _data) 
        internal 
        pure 
        returns (uint amountOut) 
    {
        uint256 convertRatePrice = 10 ** _data.priceDecimals;
        uint256 convertRateLeverage = _data.spreadFactor;
        uint256 convertRateScale = 10 ** _data.scaleDecimals;
        uint256 convertRateIn;
        uint256 convertRateOut;
        if (_data.tokenIn == _data.tokenX) {
            convertRateIn = 10 ** _data.tokenXdecimals;
            convertRateOut = 10 ** _data.tokenYdecimals;
        } else {
            convertRateIn = 10 ** _data.tokenYdecimals;
            convertRateOut = 10 ** _data.tokenXdecimals;
        }

        // Calculation is equivalent to amountOut = amountIn * priceInOut * (1 - leverage);
        uint256 amountInScaled = amountIn * convertRateScale / convertRateIn;
        uint256 amountOutScaled;
        if (_data.tokenIn == _data.tokenX) {
            amountOutScaled = amountInScaled * _data.oraclePrice / convertRatePrice;
        } else {
            amountOutScaled = amountInScaled * convertRatePrice / _data.oraclePrice;
        }
        amountOutScaled = amountOutScaled - amountOutScaled * _data.leveragePercent / convertRateLeverage;
        amountOut = amountOutScaled * convertRateOut / convertRateScale;
    }

    function _getAmountIn(uint amountOut, TokensInputData memory _data) 
        internal 
        pure 
        returns (uint amountIn) 
    {
        uint256 convertRatePrice = 10 ** _data.priceDecimals;
        uint256 convertRateLeverage = _data.spreadFactor;
        uint256 convertRateScale = 10 ** _data.scaleDecimals;
        uint256 convertRateIn;
        uint256 convertRateOut;
        if (_data.tokenIn == _data.tokenX) {
            convertRateIn = 10 ** _data.tokenXdecimals;
            convertRateOut = 10 ** _data.tokenYdecimals;
        } else {
            convertRateIn = 10 ** _data.tokenYdecimals;
            convertRateOut = 10 ** _data.tokenXdecimals;
        }

        // Calculation is equivalent to amountIn = amountOut / (priceInOut * (1 - leverage));
        uint256 denominator = _data.oraclePrice - _data.oraclePrice * _data.leveragePercent / convertRateLeverage;
        uint256 amountOutScaled = amountOut * convertRateScale / convertRateOut;
        uint256 amountInScaled;
        if (_data.tokenIn == _data.tokenX) {
            amountInScaled = amountOutScaled * convertRatePrice / denominator;
        } else {
            amountInScaled = amountOutScaled * denominator / convertRatePrice;
        }
        amountIn = amountInScaled * convertRateIn / convertRateScale;
    }

    // call this function from line 182 on uniswap v2 pair 
    // after assigning all values to TokensInputData fields as a parameter
    // here is an example source code line on a suitable place call validateData function
    // https://github.com/Uniswap/v2-core/blob/master/contracts/UniswapV2Pair.sol#L182
    function validateData(TokensInputData memory poolData) 
        external 
        pure 
        returns (uint256 post_k, uint256 wow) 
    {
        post_k = _k(poolData.balanceX, poolData.balanceY);
        require(post_k >= _k(poolData.reserveX, poolData.reserveY), "K mismatch");
        wow = 10 ** poolData.scaleDecimals;
    }

    function _k(uint256 x, uint256 y) 
        internal 
        pure
        returns (uint256) 
    {
        return x * y;
    }
}
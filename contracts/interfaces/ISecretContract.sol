// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface ISecretContract {
    struct TokensInputData {
		// address of token0 (token X) of Liquidity Pool
           address tokenX;

		// address of token1 (token Y) of Liquidity Pool
           address tokenY;   

		// address of InputToken of Liquidity Pool , which is must be either token X or token Y
           address tokenIn; 

        // address of Liquidity Pool contract where the actual reserves are stored for tokenX and tokenY
           address liquidityPool;   

        // Amount of current reserve liquidity of token0 (token X) (uint256)
           uint256 reserveX; 

        // Amount of current reserve liquidity of token1 (token Y) (uint256)
           uint256 reserveY; 

        // price of tokenX in terms of token Y  (uint256)
		// (for e.g., if token0=Polygon and token1=USDC and then _oraclePrice = Price of Polygon in USDC   
           uint256 oraclePrice; 

        // Last invariant value of the liquidity Pool from the Pool storage (uint256) 
           uint256 lastInvariant; 

        // a value between 0000 and 1000 , few example possible values 0001 or 0050 or 0900 or 0999 etc.
           uint256 spreadFactor;

        // a value between 0000 and 1000 , few example possible values 0001 or 0050 or 0900 or 0950 etc.
           uint256 leveragePercent;  
        
        // **********************
        //following parameters are for decimal places (mainly for precision scaling purpose)
		// **********************
		// pass the value of decimal places for reserveX field for tokenX ,
		// you can use decimals() function of the ERC20 tokenX token to get the value 
		// for e.g., if tokenX=WETH then tokenXdecimals=18 or if tokenX=USDT then tokenXdecimals=6 
           uint256 tokenXdecimals; 

        // pass the value of decimal places for reserveY field for tokenY ,
		// you can use decimals() function of the ERC20 tokenY token to get the value 
		// for e.g., if tokenY=DAI or TUSD then tokenYdecimals=18 or if tokenY=USDC then tokenYdecimals=6 
           uint256 tokenYdecimals;

        // pass the decimal places used on value passed to oraclePrice field ,
		// for e.g., if BTC/ETH price is with 18 decimals then priceDecimals=18
           uint256 priceDecimals;

		// pass the decimal places used on value passed to leveragePercent field , i.e., leverageDecimals=4  
           uint256 leverageDecimals;

        //pass the desired scaling  value in 2 digits in the range [18..32] , min=18 and max=32    
           uint256 scaleDecimals;

        // *************************************
        // following parameters are used only in validateData function
        // for call to getAmountOut and getAmountIn , assign 0 to all fields below
		// *************************************
        uint256 balanceX; // assign liquidity Pool balance for tokenX i.e., _balance0 
        uint256 balanceY; //assign liquidity Pool balance for tokenY  i.e., _balance1 
        uint256 amountXIn;  // if amount0In == token0 of Liquidity Pool , assign the amount0In , else 0
        uint256 amountXOut; // if amount0Out == token0 of Liquidity Pool , assign the amount0Out , else 0 
        uint256 amountYIn;  // if amount1In == token1 of Liquidity Pool , assign the amount1In , else 0
        uint256 amountYOut; // if amount1Out == token1 of Liquidity Pool , assign the amount1Out , else 0 
    }

    function getAmountOut(uint amountIn, TokensInputData memory _data) external pure returns (uint amountOut);
    function getAmountIn(uint amountOut, TokensInputData memory _data) external pure returns (uint amountIn);
    function validateData(TokensInputData memory poolData) external pure returns (uint256 post_k, uint256 wow);
}
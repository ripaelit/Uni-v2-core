// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IFairSwapFactory {
    event PairCreated(address indexed token0, address indexed token1, address pair, uint);

    function feeTo() external view returns (address);
    function feeToSetter() external view returns (address);
    function oracle() external view returns (address);
    function secret() external view returns (address);
    // function quoteAddress() external view returns (address);

    function getPair(address tokenA, address tokenB) external view returns (address pair);
    function allPairs(uint) external view returns (address pair);
    function allPairsLength() external view returns (uint);

    function createPair(address tokenA, address tokenB) external returns (address pair);

    function setFeeTo(address) external;
    function setFeeToSetter(address) external;
    function setOracle(address _oracle) external;
    function setSecret(address _secret) external;

    // function setQuoteAddress(address _quoteAddress) external;
    function setPairLeverage(address _pair,uint percentValue) external;
    function setPairLeverage(address tokenA, address tokenB,uint percentValue) external;
}

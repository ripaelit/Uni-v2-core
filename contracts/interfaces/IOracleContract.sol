// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IOracleContract {
    event AggregatorSet(bytes32 pairId, address tokenA, address tokenB, address aggregator);
    event AggregatorRemoved(bytes32 pairId, address tokenA, address tokenB);

    function getPrice(address tokenA, address tokenB, uint8 precision) external view returns (uint256 price);
    function getAggregator(address tokenA, address tokenB) external view returns (address);
    function setAggregator(address tokenA, address tokenB, address aggregator) external;
    function removeAggregator(address tokenA, address tokenB) external;
}
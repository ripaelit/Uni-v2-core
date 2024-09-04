// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IFairSwapFactory.sol";
import "./interfaces/IOracleContract.sol";
import "./FairSwapPair.sol";

contract FairSwapFactory is IFairSwapFactory, Ownable {
    address public feeTo;
    address public feeToSetter;
    address public oracle;
    address public secret;
    // address public quoteAddress;
    
    mapping(address => mapping(address => address)) public getPair;
    address[] public allPairs;

    constructor(address _feeToSetter) {
        feeToSetter = _feeToSetter;
    }

    function allPairsLength() external view returns (uint) {
        return allPairs.length;
    }

    function createPair(address tokenA, address tokenB) external returns (address pair) {
        require(tokenA != tokenB, "FairSwap: IDENTICAL_ADDRESSES");
        (address token0, address token1) = tokenA < tokenB ? (tokenA, tokenB) : (tokenB, tokenA);
        require(token0 != address(0), "FairSwap: ZERO_ADDRESS");
        require(IOracleContract(oracle).getPrice(tokenA, tokenB, 8) != 0, "FairSwapFactory: No aggregator found");
        require(getPair[token0][token1] == address(0), "FairSwap: PAIR_EXISTS"); // single check is sufficient
        bytes memory bytecode = type(FairSwapPair).creationCode;
        bytes32 salt = keccak256(abi.encodePacked(token0, token1));
        assembly {
            pair := create2(0, add(bytecode, 32), mload(bytecode), salt)
        }
        IFairSwapPair(pair).initialize(token0, token1);
        getPair[token0][token1] = pair;
        getPair[token1][token0] = pair; // populate mapping in the reverse direction
        allPairs.push(pair);
        emit PairCreated(token0, token1, pair, allPairs.length);
    }

    function setFeeTo(address _feeTo) external {
        require(msg.sender == feeToSetter, "FairSwap: FORBIDDEN");
        feeTo = _feeTo;
    }
    function setFeeToSetter(address _feeToSetter) external {
        require(msg.sender == feeToSetter, "FairSwap: FORBIDDEN");
        feeToSetter = _feeToSetter;
    }
    function setOracle(address _oracle) external onlyOwner {
        require(_oracle != address(0), "Invalid oracle");
        oracle = _oracle;
    }
    function setSecret(address _secret) external onlyOwner {
        require(_secret != address(0), "Invalid secret");
        secret = _secret;
    }

    // set the base address in case of derived price 
    // function setQuoteAddress(address _quoteAddress) external onlyOwner {
    //     require(_quoteAddress != address(0), "Invalid secret"); 
    //     quoteAddress = _quoteAddress;
    // }
    function setPairLeverage(address _pair,uint percentValue) external onlyOwner {
        require(_pair != address(0), "Invalid pair");
       IFairSwapPair(_pair).setLeveragePercent(percentValue);
    }
    function setPairLeverage(address tokenA, address tokenB,uint percentValue) external onlyOwner {
        address _pair = getPair[tokenA][tokenB];
        require(_pair != address(0), "Invalid pair");
        IFairSwapPair(_pair).setLeveragePercent(percentValue);
    }
}
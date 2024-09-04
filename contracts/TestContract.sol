// SPDX-License-Identifier: BUSL-1.1

pragma solidity ^0.8.9;

import "./FairSwapPair.sol";

contract TestContract {
    function getByteCode() public pure returns (bytes memory) {
        return type(FairSwapPair).creationCode;
    }
    
    function getByteCodeHash() public pure returns (bytes32) {
        return keccak256(getByteCode());
    }

    function computeAddress(bytes memory _byteCode, address sender, uint256 _salt) public pure returns (address ) {
        bytes32 hash_ = keccak256(abi.encodePacked(bytes1(0xff), sender, _salt, keccak256(_byteCode)));
        return address(uint160(uint256(hash_)));
    }

    function sortTokens(address tokenA, address tokenB) public pure returns (address token0, address token1) {
        require(tokenA != tokenB, "FairSwapLibrary: IDENTICAL_ADDRESSES");
        (token0, token1) = tokenA < tokenB ? (tokenA, tokenB) : (tokenB, tokenA);
        require(token0 != address(0), "FairSwapLibrary: ZERO_ADDRESS");
    }

    function pairFor(address factory, address tokenA, address tokenB) public pure returns (address pair) {
        (address token0, address token1) = sortTokens(tokenA, tokenB);
        pair = address(uint160(uint256(keccak256(abi.encodePacked(
                bytes1(0xff),
                factory,
                keccak256(abi.encodePacked(token0, token1)),
                bytes32(0x77c606a18e1d59720edc9d09e7e897e700ea90b5ef3fc862ee31199d2d7193a5) // bytecode hash of FairSwapPair
            )))));
    }
}

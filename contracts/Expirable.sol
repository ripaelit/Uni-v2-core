// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Expirable is Ownable {
    uint expirationTime;

    function setExpirationTime(uint _expirationTime) external onlyOwner {
        expirationTime = _expirationTime;
    }

    modifier checkExpiration() {
        require(block.timestamp < expirationTime, "Expirable: Expired");
        _;
    }
}
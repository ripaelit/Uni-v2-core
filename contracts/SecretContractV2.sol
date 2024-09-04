// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./SecretContract.sol";
import "./Expirable.sol";

contract SecretContractV2 is SecretContract, Expirable {
    event TestExpiration(uint expirationTime, uint currentTime);
    function testExpiration() public checkExpiration {
        emit TestExpiration(expirationTime, block.timestamp);
    }
}
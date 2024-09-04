// SPDX-License-Identifier: BUSL-1.1

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockToken is ERC20 {
    uint8 private _decimals;
    constructor(
        string memory _name,
        string memory _symbol,
        uint8 _decimals_
    ) ERC20(_name, _symbol) {
        _mint(msg.sender, 10000000 * (10**_decimals_));
        _decimals = _decimals_;
    }

    function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }

    function mint(address _to, uint256 _amount) public {
        _mint(_to, _amount);
    }
}

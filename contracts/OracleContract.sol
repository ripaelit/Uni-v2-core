// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "./interfaces/IOracleContract.sol";

contract OracleContract is IOracleContract, Ownable {
    struct PriceFeed {
        address assetA;
        address assetB;
        address aggregator;
    }

    address public constant USD_ADDRESS = address(0);   // USD has no contract so set as zero address
    mapping(bytes32 => address) private _aggregators; // assetId => aggregator

    /**
     * @notice Get price
     * @param assetA Base asset address
     * @param assetB Second asset address
     * @param precision Precision of the price
     * @return price Price answer for the given round
     * Aggregator contract does not expose this information
     */
    function getPrice(address assetA, address assetB, uint8 precision)
        external
        view
        virtual
        returns (uint256 price)
    {
        address aggregator = _getAggregator(assetA, assetB);
        if (aggregator == address(0)) {
            // Use seperate USD aggregators for assetA and assetB
            address aggregatorA = _getAggregator(assetA, USD_ADDRESS);
            address aggregatorB = _getAggregator(assetB, USD_ADDRESS);
            if (aggregatorA == address(0) || aggregatorB == address(0)) {
                return 0;
            }

            (,int256 _priceA,,,) = AggregatorV3Interface(aggregatorA).latestRoundData();
            (,int256 _priceB,,,) = AggregatorV3Interface(aggregatorB).latestRoundData();
            price = uint256(_priceA) * (10**precision) / uint256(_priceB);
        } else {
            // Use direct aggregator
            (,int256 _price,,,) = AggregatorV3Interface(aggregator).latestRoundData();
            uint8 _priceDecimals = AggregatorV3Interface(aggregator).decimals();
            price = uint256(_scalePrice(_price, _priceDecimals, precision));
        }
    }

    // region - Public service function -

    /**
     * @notice Set aggregator address
     * @param assetA Base asset address
     * @param assetB Second asset address
     * @param aggregator Chainlink aggregator address
     * @dev Only owner can set aggregator
     */
    function setAggregator(address assetA, address assetB, address aggregator)
        external
        virtual
        onlyOwner
    {
        _setAggregator(assetA, assetB, aggregator);
    }

    function setAggregators(PriceFeed[] calldata priceFeeds)
        external
        virtual
        onlyOwner
    {
        for (uint i = 0; i < priceFeeds.length; ++i) {
            _setAggregator(priceFeeds[i].assetA, priceFeeds[i].assetB, priceFeeds[i].aggregator);
        }
    }

    /**
     * @notice Remove aggregator address
     * @param assetA Base asset address
     * @param assetB Second asset address
     * @dev Only owner can remove aggregator
     */
    function removeAggregator(address assetA, address assetB)
        external
        virtual
        onlyOwner
    {
        bytes32 assetId = _getAssetId(assetA, assetB);
        require(_aggregators[assetId] != address(0), "OracleContract: No aggregator to remove");
        
        delete _aggregators[assetId];

        emit AggregatorRemoved(assetId, assetA, assetB);
    }

    /**
     * @notice Get aggregator address by naming assets
     * @param assetA Base asset address
     * @param assetB Second asset address
     */
    function getAggregator(address assetA, address assetB)
        external
        view
        virtual
        returns (address)
    {
        return _getAggregator(assetA, assetB);
    }

    function _getAggregator(address assetA, address assetB)
        internal
        view
        virtual
        returns (address)
    {
        bytes32 assetId = _getAssetId(assetA, assetB);
        return _aggregators[assetId];
    }

    function _getAssetId(address assetA, address assetB) internal pure virtual returns (bytes32 assetId) {
        assetId = keccak256(abi.encodePacked(assetA, assetB));
    }

    function _scalePrice(int256 price, uint256 fromDecimals, uint256 toDecimals) internal pure virtual returns (int256) {
        if (fromDecimals < toDecimals) {
            return price * int256(10 ** (toDecimals - fromDecimals));
        }
        else if (fromDecimals > toDecimals) {
            return price / int256(10 ** (fromDecimals - toDecimals));
        }
        return price;
    }

    function _setAggregator(address assetA, address assetB, address aggregator) internal {
        require(assetA != assetB, "OracleContract: Invalid assets");
        require(aggregator != address(0), "OracleContract: Invalid aggregator");

        bytes32 assetId = _getAssetId(assetA, assetB);
        _aggregators[assetId] = aggregator;

        emit AggregatorSet(assetId, assetA, assetB, aggregator);
    }
}
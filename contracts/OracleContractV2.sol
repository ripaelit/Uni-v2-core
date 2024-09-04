// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./OracleContract.sol";
import {IPyth} from "@pythnetwork/pyth-sdk-solidity/IPyth.sol";
import {PythStructs} from "@pythnetwork/pyth-sdk-solidity/PythStructs.sol";

contract OracleContractV2 is OracleContract {
    struct PriceFeedV2 {
        address assetA;
        address assetB;
        bytes32 priceId;
    }

    IPyth pyth;
    mapping(bytes32 => bytes32) private _priceIds;  // assetId => priceId

    event PriceIdSet(bytes32 assetId, bytes32 priceId);
    event PriceIdRemoved(bytes32 assetId, bytes32 priceId);
    // event PriceReceived(PythStructs.Price price);
    // event PriceReceived(int256 derivedPrice);
    // event PriceFeedsUpdated();

    error InvalidAssets();
    error PriceIdNotFound(address assetA, address assetB);
    error InvalidPrecision();

    function getPrice(address assetA, address assetB, uint8 precision)
        external
        view
        virtual
        override
        returns (uint256 price)
    {
        bytes32 priceID = getPriceId(assetA, assetB);
        if (priceID == bytes32(0)) {
            bytes32 priceIdA = getPriceId(assetA, USD_ADDRESS);
            bytes32 priceIdB = getPriceId(assetB, USD_ADDRESS);
            if (priceIdA == bytes32(0) || priceIdB == bytes32(0)) {
                return 0;
            }
            PythStructs.Price memory pythPriceA = pyth.getPriceUnsafe(priceIdA);
            PythStructs.Price memory pythPriceB = pyth.getPriceUnsafe(priceIdB);
            int256 _priceA = _scalePythPrice(pythPriceA.price, pythPriceA.expo, precision);
            int256 _priceB = _scalePythPrice(pythPriceB.price, pythPriceB.expo, precision);
            price = uint256(_priceA) * (10**precision) / uint256(_priceB);
        } else {
            PythStructs.Price memory pythPrice = pyth.getPriceUnsafe(priceID);
            price = uint256(_scalePythPrice(pythPrice.price, pythPrice.expo, precision));
        }
    }

    function getPriceId(address assetA, address assetB)
        public
        view
        virtual
        returns (bytes32 priceId)
    {
        bytes32 assetId = _getAssetId(assetA, assetB);
        priceId = _priceIds[assetId];
    }

    function setPythContract(address pythContract) 
        external 
        virtual
        onlyOwner 
    {
        require(pythContract != address(0), "OracleContractV2: Invalid address");
        pyth = IPyth(pythContract);
    }

    function setPriceId(address assetA, address assetB, bytes32 priceId)
        external
        virtual
        onlyOwner
    {
        _setPriceId(assetA, assetB, priceId);
    }

    function setPriceIds(PriceFeedV2[] calldata priceFeeds)
        external
        virtual
        onlyOwner
    {
        for (uint i = 0; i < priceFeeds.length; ++i) {
            _setPriceId(priceFeeds[i].assetA, priceFeeds[i].assetB, priceFeeds[i].priceId);
        }
    }

    function removePriceId(address assetA, address assetB)
        external
        onlyOwner
    {
        bytes32 assetId = _getAssetId(assetA, assetB);
        bytes32 priceId = _priceIds[assetId];

        if (priceId != bytes32(0)) {
            delete _priceIds[assetId];

            emit PriceIdRemoved(assetId, priceId);
        }
    }

    function _scalePythPrice(int64 price, int32 expo, uint8 decimals) private pure returns (int256) {
        uint256 convertedPriceDecimals;
        int256 convertedPrice;

        if (expo < 0) {
            convertedPriceDecimals = uint256(int256(-expo));

            return _scalePrice(int256(price), convertedPriceDecimals, decimals);
        }
        else {
            convertedPriceDecimals = uint256(int256(expo));
            convertedPrice = int256(price) * int256(10 ** convertedPriceDecimals);

            return _scalePrice(convertedPrice, 0, decimals);
        }
    }

    function _setPriceId(address assetA, address assetB, bytes32 priceId)
        internal
    {
        require(assetA != assetB, "OracleContractV2: Invalid assets");
        require(priceId != bytes32(0), "OracleContractV2: Invalid price id");
        bytes32 assetId = _getAssetId(assetA, assetB);

        _priceIds[assetId] = priceId;

        emit PriceIdSet(assetId, priceId);
    }
}
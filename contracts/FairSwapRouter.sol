// SPDX-License-Identifier: BUSL-1.1

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "./interfaces/IOracleContract.sol";
import "./interfaces/IFairSwapRouter.sol";
import "./interfaces/IFairSwapFactory.sol";
import "./interfaces/IWETH.sol";
import "./interfaces/IFairSwapERC20.sol";
import "./libraries/FairSwapLibrary.sol";
import "./libraries/TransferHelper.sol";

contract FairSwapRouter is IFairSwapRouter {
    using SafeERC20 for IERC20;

    address public immutable factory;
    address public immutable WETH;

    modifier ensure(uint deadline) {
        require(deadline >= block.timestamp, "FairSwapRouter: EXPIRED");
        _;
    }

    constructor(
        address _factory, 
        address _WETH
    ) {
        factory = _factory;
        WETH = _WETH;
    }

    receive() external payable {
        assert(msg.sender == WETH); // only accept ETH via fallback from the WETH contract
    }

    // **** ADD LIQUIDITY ****
    function _checkPair(address tokenA, address tokenB) internal virtual {
        // create the pair if it doesn't exist yet
        if (IFairSwapFactory(factory).getPair(tokenA, tokenB) == address(0)) {
            IFairSwapFactory(factory).createPair(tokenA, tokenB);
        }
    }
    function quoteAddLiquidity(
        address tokenA,
        address tokenB,
        uint amountADesired,
        uint amountBDesired,
        uint amountAMin,
        uint amountBMin
    ) public view virtual returns (uint amountA, uint amountB) {
        IOracleContract oracle = IOracleContract(IFairSwapFactory(factory).oracle());
        uint8 tokenADecimals = IERC20Metadata(tokenA).decimals();
        uint8 tokenBDecimals = IERC20Metadata(tokenB).decimals();
        uint oraclePriceA = oracle.getPrice(tokenA, address(0), 8);
        uint oraclePriceB = oracle.getPrice(tokenB, address(0), 8);
        uint amountBOptimal = FairSwapLibrary.quoteWithOracle(amountADesired, oraclePriceA, oraclePriceB, tokenADecimals, tokenBDecimals);
        if (amountBOptimal <= amountBDesired) {
            require(amountBOptimal >= amountBMin, "FairSwapRouter: INSUFFICIENT_B_AMOUNT");
            (amountA, amountB) = (amountADesired, amountBOptimal);
        } else {
            uint amountAOptimal = FairSwapLibrary.quoteWithOracle(amountBDesired, oraclePriceB, oraclePriceA, tokenBDecimals, tokenADecimals);
            assert(amountAOptimal <= amountADesired);
            require(amountAOptimal >= amountAMin, "FairSwapRouter: INSUFFICIENT_A_AMOUNT");
            (amountA, amountB) = (amountAOptimal, amountBDesired);
        }
    }
    function _addLiquidity(
        address tokenA,
        address tokenB,
        uint amountA,
        uint amountB,
        address to
    ) internal virtual returns (uint liquidity) {
        address pair = FairSwapLibrary.pairFor(factory, tokenA, tokenB);
        TransferHelper.safeTransferFrom(tokenA, msg.sender, pair, amountA);
        TransferHelper.safeTransferFrom(tokenB, msg.sender, pair, amountB);
        liquidity = IFairSwapPair(pair).mint(to);
    }
    function addLiquidity(
        address tokenA,
        address tokenB,
        uint amountADesired,
        uint amountBDesired,
        uint amountAMin,
        uint amountBMin,
        address to,
        uint deadline
    ) external virtual override ensure(deadline) returns (uint amountA, uint amountB, uint liquidity) {
        _checkPair(tokenA, tokenB);
        (amountA, amountB) = quoteAddLiquidity(
            tokenA, 
            tokenB, 
            amountADesired, 
            amountBDesired, 
            amountAMin, 
            amountBMin
        );
        liquidity = _addLiquidity(tokenA, tokenB, amountA, amountB, to);
        emit AddLiquidity(tokenA, tokenB, amountA, amountB, liquidity);
    }
    function addLiquidityETH(
        address token,
        uint amountTokenDesired,
        uint amountTokenMin,
        uint amountETHMin,
        address to,
        uint deadline
    ) external virtual override payable ensure(deadline) returns (uint amountToken, uint amountETH, uint liquidity) {
        _checkPair(token, WETH);
        (amountToken, amountETH) = quoteAddLiquidity(
            token,
            WETH,
            amountTokenDesired,
            msg.value,
            amountTokenMin,
            amountETHMin
        );
        address pair = FairSwapLibrary.pairFor(factory, token, WETH);
        TransferHelper.safeTransferFrom(token, msg.sender, pair, amountToken);
        IWETH(WETH).deposit{value: amountETH}();
        assert(IWETH(WETH).transfer(pair, amountETH));
        liquidity = IFairSwapPair(pair).mint(to);
        // refund dust eth, if any
        if (msg.value > amountETH) TransferHelper.safeTransferETH(msg.sender, msg.value - amountETH);
        emit AddLiquidity(token, WETH, amountToken, amountETH, liquidity);
    }

    // **** REMOVE LIQUIDITY ****
    function removeLiquidity(
        address tokenA,
        address tokenB,
        uint liquidity,
        uint amountAMin,
        uint amountBMin,
        address to,
        uint deadline
    ) public virtual override ensure(deadline) returns (uint amountA, uint amountB) {
        address pair = FairSwapLibrary.pairFor(factory, tokenA, tokenB);
        IFairSwapERC20(pair).transferFrom(msg.sender, pair, liquidity); // send liquidity to pair
        (uint amount0, uint amount1) = IFairSwapPair(pair).burn(to);
        (address token0,) = FairSwapLibrary.sortTokens(tokenA, tokenB);
        (amountA, amountB) = tokenA == token0 ? (amount0, amount1) : (amount1, amount0);
        require(amountA >= amountAMin, "FairSwapRouter: INSUFFICIENT_A_AMOUNT");
        require(amountB >= amountBMin, "FairSwapRouter: INSUFFICIENT_B_AMOUNT");
        emit RemoveLiquidity(tokenA, tokenB, amountA, amountB);
    }
    function removeLiquidityETH(
        address token,
        uint liquidity,
        uint amountTokenMin,
        uint amountETHMin,
        address to,
        uint deadline
    ) public virtual override ensure(deadline) returns (uint amountToken, uint amountETH) {
        (amountToken, amountETH) = removeLiquidity(
            token,
            WETH,
            liquidity,
            amountTokenMin,
            amountETHMin,
            address(this),
            deadline
        );
        TransferHelper.safeTransfer(token, to, amountToken);
        IWETH(WETH).withdraw(amountETH);
        TransferHelper.safeTransferETH(to, amountETH);
    }
    function removeLiquidityWithPermit(
        address tokenA,
        address tokenB,
        uint liquidity,
        uint amountAMin,
        uint amountBMin,
        address to,
        uint deadline,
        bool approveMax, uint8 v, bytes32 r, bytes32 s
    ) external virtual override returns (uint amountA, uint amountB) {
        address pair = FairSwapLibrary.pairFor(factory, tokenA, tokenB);
        uint value = approveMax ? type(uint256).max : liquidity;
        IFairSwapERC20(pair).permit(msg.sender, address(this), value, deadline, v, r, s);
        (amountA, amountB) = removeLiquidity(tokenA, tokenB, liquidity, amountAMin, amountBMin, to, deadline);
    }
    function removeLiquidityETHWithPermit(
        address token,
        uint liquidity,
        uint amountTokenMin,
        uint amountETHMin,
        address to,
        uint deadline,
        bool approveMax, uint8 v, bytes32 r, bytes32 s
    ) external virtual override returns (uint amountToken, uint amountETH) {
        address pair = FairSwapLibrary.pairFor(factory, token, WETH);
        uint value = approveMax ? type(uint256).max : liquidity;
        IFairSwapERC20(pair).permit(msg.sender, address(this), value, deadline, v, r, s);
        (amountToken, amountETH) = removeLiquidityETH(token, liquidity, amountTokenMin, amountETHMin, to, deadline);
    }

    // **** REMOVE LIQUIDITY (supporting fee-on-transfer tokens) ****
    function removeLiquidityETHSupportingFeeOnTransferTokens(
        address token,
        uint liquidity,
        uint amountTokenMin,
        uint amountETHMin,
        address to,
        uint deadline
    ) public virtual override ensure(deadline) returns (uint amountETH) {
        (, amountETH) = removeLiquidity(
            token,
            WETH,
            liquidity,
            amountTokenMin,
            amountETHMin,
            address(this),
            deadline
        );
        TransferHelper.safeTransfer(token, to, IERC20(token).balanceOf(address(this)));
        IWETH(WETH).withdraw(amountETH);
        TransferHelper.safeTransferETH(to, amountETH);
    }
    function removeLiquidityETHWithPermitSupportingFeeOnTransferTokens(
        address token,
        uint liquidity,
        uint amountTokenMin,
        uint amountETHMin,
        address to,
        uint deadline,
        bool approveMax, uint8 v, bytes32 r, bytes32 s
    ) external virtual override returns (uint amountETH) {
        address pair = FairSwapLibrary.pairFor(factory, token, WETH);
        uint value = approveMax ? type(uint256).max : liquidity;
        IFairSwapERC20(pair).permit(msg.sender, address(this), value, deadline, v, r, s);
        amountETH = removeLiquidityETHSupportingFeeOnTransferTokens(
            token, liquidity, amountTokenMin, amountETHMin, to, deadline
        );
    }

    // **** SWAP ****
    // requires the initial amount to have already been sent to the first pair
    function _swap(uint[] memory amounts, address[] memory path, address _to) internal virtual {
        for (uint i; i < path.length - 1; i++) {
            (address input, address output) = (path[i], path[i + 1]);
            (address token0,) = FairSwapLibrary.sortTokens(input, output);
            uint amountOut = amounts[i + 1];
            (uint amount0Out, uint amount1Out) = input == token0 ? (uint(0), amountOut) : (amountOut, uint(0));
            address to = i < path.length - 2 ? FairSwapLibrary.pairFor(factory, output, path[i + 2]) : _to;
            IFairSwapPair(FairSwapLibrary.pairFor(factory, input, output)).swap(
                amount0Out, amount1Out, to, new bytes(0)
            );
            emit Swap(path[i], path[i + 1], amounts[i], amounts[i + 1], to);
        }
    }
    function swapExactTokensForTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external virtual override ensure(deadline) returns (uint[] memory amounts) {
        // amounts = FairSwapLibrary.getAmountsOut(factory, amountIn, path);
        amounts = getAmountsOut(amountIn, path);
        require(amounts[amounts.length - 1] >= amountOutMin, "FairSwapRouter: INSUFFICIENT_OUTPUT_AMOUNT");
        TransferHelper.safeTransferFrom(
            path[0], msg.sender, FairSwapLibrary.pairFor(factory, path[0], path[1]), amounts[0]
        );
        _swap(amounts, path, to);
    }
    function swapTokensForExactTokens(
        uint amountOut,
        uint amountInMax,
        address[] calldata path,
        address to,
        uint deadline
    ) external virtual override ensure(deadline) returns (uint[] memory amounts) {
        // amounts = FairSwapLibrary.getAmountsIn(factory, amountOut, path);
        amounts = getAmountsIn(amountOut, path);
        require(amounts[0] <= amountInMax, "FairSwapRouter: EXCESSIVE_INPUT_AMOUNT");
        TransferHelper.safeTransferFrom(
            path[0], msg.sender, FairSwapLibrary.pairFor(factory, path[0], path[1]), amounts[0]
        );
        _swap(amounts, path, to);
    }
    function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline)
        external
        virtual
        override
        payable
        ensure(deadline)
        returns (uint[] memory amounts)
    {
        require(path[0] == WETH, "FairSwapRouter: INVALID_PATH");
        // amounts = FairSwapLibrary.getAmountsOut(factory, msg.value, path);
        amounts = getAmountsOut(msg.value, path);
        require(amounts[amounts.length - 1] >= amountOutMin, "FairSwapRouter: INSUFFICIENT_OUTPUT_AMOUNT");
        IWETH(WETH).deposit{value: amounts[0]}();
        assert(IWETH(WETH).transfer(FairSwapLibrary.pairFor(factory, path[0], path[1]), amounts[0]));
        _swap(amounts, path, to);
    }
    function swapETHForExactTokens(uint amountOut, address[] calldata path, address to, uint deadline)
        external
        virtual
        override
        payable
        ensure(deadline)
        returns (uint[] memory amounts)
    {
        require(path[0] == WETH, "FairSwapRouter: INVALID_PATH");
        // amounts = FairSwapLibrary.getAmountsIn(factory, amountOut, path);
        amounts = getAmountsIn(amountOut, path);
        require(amounts[0] <= msg.value, "FairSwapRouter: EXCESSIVE_INPUT_AMOUNT");
        IWETH(WETH).deposit{value: amounts[0]}();
        assert(IWETH(WETH).transfer(FairSwapLibrary.pairFor(factory, path[0], path[1]), amounts[0]));
        _swap(amounts, path, to);
        // refund dust eth, if any
        if (msg.value > amounts[0]) TransferHelper.safeTransferETH(msg.sender, msg.value - amounts[0]);
    }
    function swapExactTokensForETH(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline)
        external
        virtual
        override
        ensure(deadline)
        returns (uint[] memory amounts)
    {
        require(path[path.length - 1] == WETH, "FairSwapRouter: INVALID_PATH");
        // amounts = FairSwapLibrary.getAmountsOut(factory, amountIn, path);
        amounts = getAmountsOut(amountIn, path);
        require(amounts[amounts.length - 1] >= amountOutMin, "FairSwapRouter: INSUFFICIENT_OUTPUT_AMOUNT");
        TransferHelper.safeTransferFrom(
            path[0], msg.sender, FairSwapLibrary.pairFor(factory, path[0], path[1]), amounts[0]
        );
        _swap(amounts, path, address(this));
        IWETH(WETH).withdraw(amounts[amounts.length - 1]);
        TransferHelper.safeTransferETH(to, amounts[amounts.length - 1]);
    }
    function swapTokensForExactETH(uint amountOut, uint amountInMax, address[] calldata path, address to, uint deadline)
        external
        virtual
        override
        ensure(deadline)
        returns (uint[] memory amounts)
    {
        require(path[path.length - 1] == WETH, "FairSwapRouter: INVALID_PATH");
        // amounts = FairSwapLibrary.getAmountsIn(factory, amountOut, path);
        amounts = getAmountsIn(amountOut, path);
        require(amounts[0] <= amountInMax, "FairSwapRouter: EXCESSIVE_INPUT_AMOUNT");
        TransferHelper.safeTransferFrom(
            path[0], msg.sender, FairSwapLibrary.pairFor(factory, path[0], path[1]), amounts[0]
        );
        _swap(amounts, path, address(this));
        IWETH(WETH).withdraw(amounts[amounts.length - 1]);
        TransferHelper.safeTransferETH(to, amounts[amounts.length - 1]);
    }

    // **** SWAP (supporting fee-on-transfer tokens) ****
    // requires the initial amount to have already been sent to the first pair
    function _swapSupportingFeeOnTransferTokens(address[] memory path, address _to) internal virtual {
        for (uint i; i < path.length - 1; i++) {
            (address input, address output) = (path[i], path[i + 1]);
            (address token0,) = FairSwapLibrary.sortTokens(input, output);
            IFairSwapPair pair = IFairSwapPair(FairSwapLibrary.pairFor(factory, input, output));
            uint amountInput;
            uint amountOutput;
            { // scope to avoid stack too deep errors
            (uint reserve0, uint reserve1,) = pair.getReserves();
            (uint reserveInput, uint reserveOutput) = input == token0 ? (reserve0, reserve1) : (reserve1, reserve0);
            amountInput = IERC20(input).balanceOf(address(pair)) - reserveInput;
            // amountOutput = FairSwapLibrary.getAmountOut(amountInput, reserveInput, reserveOutput);
            amountOutput = getAmountOut(amountInput, input, output);
            }
            (uint amount0Out, uint amount1Out) = input == token0 ? (uint(0), amountOutput) : (amountOutput, uint(0));
            address to = i < path.length - 2 ? FairSwapLibrary.pairFor(factory, output, path[i + 2]) : _to;
            pair.swap(amount0Out, amount1Out, to, new bytes(0));
        }
    }
    function swapExactTokensForTokensSupportingFeeOnTransferTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external virtual override ensure(deadline) {
        TransferHelper.safeTransferFrom(
            path[0], msg.sender, FairSwapLibrary.pairFor(factory, path[0], path[1]), amountIn
        );
        uint balanceBefore = IERC20(path[path.length - 1]).balanceOf(to);
        _swapSupportingFeeOnTransferTokens(path, to);
        require(
            IERC20(path[path.length - 1]).balanceOf(to) - balanceBefore >= amountOutMin,
            "FairSwapRouter: INSUFFICIENT_OUTPUT_AMOUNT"
        );
    }
    function swapExactETHForTokensSupportingFeeOnTransferTokens(
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    )
        external
        virtual
        override
        payable
        ensure(deadline)
    {
        require(path[0] == WETH, "FairSwapRouter: INVALID_PATH");
        uint amountIn = msg.value;
        IWETH(WETH).deposit{value: amountIn}();
        assert(IWETH(WETH).transfer(FairSwapLibrary.pairFor(factory, path[0], path[1]), amountIn));
        uint balanceBefore = IERC20(path[path.length - 1]).balanceOf(to);
        _swapSupportingFeeOnTransferTokens(path, to);
        require(
            IERC20(path[path.length - 1]).balanceOf(to) - balanceBefore >= amountOutMin,
            "FairSwapRouter: INSUFFICIENT_OUTPUT_AMOUNT"
        );
    }
    function swapExactTokensForETHSupportingFeeOnTransferTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    )
        external
        virtual
        override
        ensure(deadline)
    {
        require(path[path.length - 1] == WETH, "FairSwapRouter: INVALID_PATH");
        TransferHelper.safeTransferFrom(
            path[0], msg.sender, FairSwapLibrary.pairFor(factory, path[0], path[1]), amountIn
        );
        _swapSupportingFeeOnTransferTokens(path, address(this));
        uint amountOut = IERC20(WETH).balanceOf(address(this));
        require(amountOut >= amountOutMin, "FairSwapRouter: INSUFFICIENT_OUTPUT_AMOUNT");
        IWETH(WETH).withdraw(amountOut);
        TransferHelper.safeTransferETH(to, amountOut);
    }

    // **** LIBRARY FUNCTIONS ****
    function quote(uint amountA, uint reserveA, uint reserveB) public pure virtual override returns (uint amountB) {
        return FairSwapLibrary.quote(amountA, reserveA, reserveB);
    }

    function quoteWithOracle(uint amountA, uint oraclePriceA, uint oraclePriceB, uint8 tokenADecimals, uint8 tokenBDeicmals) public pure virtual override returns (uint amountB) {
        return FairSwapLibrary.quoteWithOracle(amountA, oraclePriceA, oraclePriceB, tokenADecimals, tokenBDeicmals);
    }

    function getAmountOut(uint amountIn, address tokenIn, address tokenOut)
        public
        view
        virtual
        override
        returns (uint amountOut)
    {
        address _oracleAddress = IFairSwapFactory(factory).oracle();
        if (_oracleAddress == address(0))   return 0;
        if (IOracleContract(_oracleAddress).getPrice(tokenIn, tokenOut, 8) == 0)    return 0;
        address _pairAddress = IFairSwapFactory(factory).getPair(tokenIn, tokenOut);
        if (_pairAddress == address(0)) return 0;

        amountOut = IFairSwapPair(_pairAddress).getAmountOut(amountIn, tokenIn);
    }

    function getAmountIn(uint amountOut, address tokenIn, address tokenOut)
        public
        view
        virtual
        override
        returns (uint amountIn)
    {
        address _oracleAddress = IFairSwapFactory(factory).oracle();
        if (_oracleAddress == address(0))   return 0;
        if (IOracleContract(_oracleAddress).getPrice(tokenIn, tokenOut, 8) == 0)    return 0;
        address _pairAddress = IFairSwapFactory(factory).getPair(tokenIn, tokenOut);
        if (_pairAddress == address(0)) return 0;

        amountIn = IFairSwapPair(_pairAddress).getAmountIn(amountOut, tokenIn);
    }

    function getAmountsOut(uint amountIn, address[] memory path)
        public
        view
        virtual
        override
        returns (uint[] memory amounts)
    {
        require(path.length >= 2, "FairSwapRouter: INVALID_PATH");
        amounts = new uint[](path.length);
        amounts[0] = amountIn;
        for (uint i; i < path.length - 1; i++) {
            amounts[i + 1] = getAmountOut(amounts[i], path[i], path[i + 1]);
        }
    }

    function getAmountsIn(uint amountOut, address[] memory path)
        public
        view
        virtual
        override
        returns (uint[] memory amounts)
    {
        require(path.length >= 2, "FairSwapRouter: INVALID_PATH");
        amounts = new uint[](path.length);
        amounts[amounts.length - 1] = amountOut;
        for (uint i = path.length - 1; i > 0; i--) {
            amounts[i - 1] = getAmountIn(amounts[i], path[i - 1], path[i]);
        }
    }
}
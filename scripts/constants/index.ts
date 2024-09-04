export const chainIds = {
  ethereum: 1,
  polygon: 137,
  goerli: 5,
  polygonMumbai: 80001,
  polygonAmoy: 80002
}

export const amoyData = {
  // Tokens
  wbtc: "0x7a153C686ef2b0D3e49760eA7537843af60B0501", // ftoken
  weth: "0x4c5303cc2c9a23F513e848e8e70176A77e63b0E3", // ftoken
  wmatic : "0x3ca6cfA5fF822a79cFBFb308738e130337E1B23C", // ftoken
  usdt : "0xe13f744288D917Dbb1Be223Ff37EdEc79F4f08D1", // ftoken
  usdc : "0xeABE0393f03DD7685d881B924c64450e3F7a9418", // ftoken
  // Aggregators for Chainlink
  btcAggregator: "0xe7656e23fE8077D438aEfbec2fAbDf2D8e070C4f",
  ethAggregator: "0xF0d50568e3A7e8259E16663972b11910F89BD8e7",
  maticAggregator : "0x001382149eBa3441043c1c66972b4772963f5D43",
  usdtAggregator : "0x3aC23DcB4eCfcBd24579e1f34542524d0E4eDeA8",
  usdcAggregator : "0x1b8739bB4CdF0089d07097A9Ae5Bd274b29C6F16",
  daiAggregator: "0x1896522f28bF5912dbA483AC38D7eE4c920fDB6E",
  solAggregator: "0xF8e2648F3F157D972198479D5C7f0D721657Af67",
  dogeAggregator: "0xa73B1C149CB4a0bf27e36dE347CBcfbe88F65DB2", // eur
  xauAggregator: "0xc2e2848e28B9fE430Ab44F55a8437a33802a219C", // link
  // Price IDs for Pyth
  btcPriceId: "0xf9c0172ba10dfa4d19088d94f5bf61d3b54d5bd7483a322a982e1373ee8ea31b",
  ethPriceId: "0xca80ba6dc32e08d06f1aa886011eed1d77c77be9eb761cc10d72b7d0a2fd57a6",
  maticPriceId: "0xd2c2c1f2bba8e0964f9589e060c2ee97f5e19057267ac3284caef3bd50bd2cb5",
  usdtPriceId: "0x1fc18861232290221461220bd4e2acd1dcdfbc89c84092c93c18bdc7756c1588",
  usdcPriceId: "0x41f3625971ca2ed2263e78573fe5ce23e13d2558ed3f2e47ab0f84fb9e7ae722",
  daiPriceId: "0x87a67534df591d2dd5ec577ab3c75668a8e3d35e92e27bf29d9e2e52df8de412",
  solPriceId: "0xfe650f0367d4a7ef9815a593ea15d36593f0643aaaf0149bb04be67ab851decd",
  dogePriceId: "0x31775e1d6897129e8a84eeba975778fb50015b88039e9bc140bbd839694ac0ae",
  xauPriceId: "0x30a19158f5a54c0adf8fb7560627343f22a1bc852b89d56be1accdc5dbf96d0e",
  // Pyth Feed
  pyth: "0x2880aB155794e7179c9eE2e38200202908C17B43"
}

export const mumbaiData = {
  // Tokens
  wbtc: "0x0d787a4a1548f673ed375445535a6c7A1EE56180",
  weth: "0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa",
  wmatic : "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889",
  usdt : "0xA02f6adc7926efeBBd59Fd43A84f4E0c0c91e832",
  usdc : "0xe6b8a5CF854791412c1f6EFC7CAf629f5Df1c747",
  // Aggregators for Chainlink
  btcAggregator: "0x007A22900a3B98143368Bd5906f8E17e9867581b",
  ethAggregator: "0x0715A7794a1dc8e42615F059dD6e406A6594651A",
  maticAggregator : "0xd0D5e3DB44DE05E9F294BB0a3bEEaF030DE24Ada",
  usdtAggregator : "0x92C09849638959196E976289418e5973CC96d645",
  usdcAggregator : "0x572dDec9087154dC5dfBB1546Bb62713147e0Ab0",
  daiAggregator: "0x0FCAa9c899EC5A91eBc3D5Dd869De833b06fB046",
  solAggregator: "0xEB0fb293f368cE65595BeD03af3D3f27B7f0BD36",
  dogeAggregator: "0x7d7356bF6Ee5CDeC22B216581E48eCC700D0497A", // eur
  xauAggregator: "0x1C2252aeeD50e0c9B64bDfF2735Ee3C932F5C408", // link
  // Price IDs for Pyth
  btcPriceId: "0xf9c0172ba10dfa4d19088d94f5bf61d3b54d5bd7483a322a982e1373ee8ea31b",
  ethPriceId: "0xca80ba6dc32e08d06f1aa886011eed1d77c77be9eb761cc10d72b7d0a2fd57a6",
  maticPriceId: "0xd2c2c1f2bba8e0964f9589e060c2ee97f5e19057267ac3284caef3bd50bd2cb5",
  usdtPriceId: "0x1fc18861232290221461220bd4e2acd1dcdfbc89c84092c93c18bdc7756c1588",
  usdcPriceId: "0x41f3625971ca2ed2263e78573fe5ce23e13d2558ed3f2e47ab0f84fb9e7ae722",
  daiPriceId: "0x87a67534df591d2dd5ec577ab3c75668a8e3d35e92e27bf29d9e2e52df8de412",
  solPriceId: "0xfe650f0367d4a7ef9815a593ea15d36593f0643aaaf0149bb04be67ab851decd",
  dogePriceId: "0x31775e1d6897129e8a84eeba975778fb50015b88039e9bc140bbd839694ac0ae",
  xauPriceId: "0x30a19158f5a54c0adf8fb7560627343f22a1bc852b89d56be1accdc5dbf96d0e",
  // Pyth Feed
  pyth: "0xFC6bd9F9f0c6481c6Af3A7Eb46b296A5B85ed379"
}

export const polygonData = {
  // Tokens
  wbtc: "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6",   // decimals 8
  weth: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",   // 18
  wmatic: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270", // 18
  usdt: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",   // 6
  usdc: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",   // 6
  dai: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",    // 18
  // Aggregators for Chainlink
  btcAggregator: "0xc907E116054Ad103354f2D350FD2514433D57F6f",
  ethAggregator: "0xF9680D99D6C9589e2a93a78A04A279e509205945",
  maticAggregator: "0xAB594600376Ec9fD91F8e885dADF0CE036862dE0",
  usdtAggregator: "0x0A6513e40db6EB1b165753AD52E80663aeA50545",
  usdcAggregator: "0xfE4A8cc5b5B2366C1B58Bea3858e81843581b2F7",
  daiAggregator: "0x4746DeC9e833A82EC7C2C1356372CcF2cfcD2F3D",
  solAggregator: "0x10C8264C0935b3B9870013e057f330Ff3e9C56dC",
  dogeAggregator: "0xbaf9327b6564454F4a3364C33eFeEf032b4b4444",
  xauAggregator: "0x0C466540B2ee1a31b441671eac0ca886e051E410",
  // Price IDs for Pyth
  btcPriceId: "0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43",
  ethPriceId: "0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace",
  maticPriceId: "0x5de33a9112c2b700b8d30b8a3402c103578ccfa2765696471cc672bd5cf6ac52",
  usdtPriceId: "0x2b89b9dc8fdf9f34709a5b106b472f0f39bb6ca9ce04b0fd7f2e971688e2e53b",
  usdcPriceId: "0xeaa020c61cc479712813461ce153894a96a6c00b21ed0cfc2798d1f9a9e9c94a",
  daiPriceId: "0xb0948a5e5313200c632b51bb5ca32f6de0d36e9950a942d19751e833f70dabfd",
  solPriceId: "0xef0d8b6fda2ceba41da15d4095d1da392a0d2f8ed0c6c7bc0f4cfac8c280b56d",
  dogePriceId: "0xdcef50dd0a4cd2dcc17e45df1676dcb336a11a61c69df7a0299b0150c672d25c",
  xauPriceId: "0x765d2ba906dbc32ca17cc11f5310a89e9ee1f6420508c63861f2f8ba4ee34bb2",
  // Pyth Feed
  pyth: "0xff1a0f4744e8582DF1aE09D5611b887B6a12925C",
  // UniswapV2
  uniswapV2Router02: "0x93bcDc45f7e62f89a8e901DC4A0E2c6C427D9F25"
}
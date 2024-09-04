import {ethers} from 'hardhat'

// Input token addresses
const tokenAddresses = [
  "0x7C9eE291869d2172FCD63cbA6163731792a3e4Fc",
  "0xD5967c7437999CD2eA87E46eff65b3B824811695",
  "0x1790711d78E636e186312A89b93ae38eF6204aA5",
  "0xf8f3377b513EC22e9187Df2541E721bD53eB024c",
  "0xbBe2feE343387f6b12DD183f9636804e302EF852",
  "0x86bc53e25B8054B3E3A5D83Bc413E624c3025026",
  "0x743D710D710162950C7cfF98A08EA1dcfBcE862F",
  "0x211d3c5ebE49591e4eedb3211C73Bbef8372b12D"
]

const toAddress = "0x5B9Ecd030f9e8e02c7c7c82A213a3f5b66480a10";

export default async function main() {
  let [owner] = await ethers.getSigners();
  const balance = await ethers.provider.getBalance(toAddress);
  console.log(toAddress, {balance});

  for (let tokenAddress of tokenAddresses) {
    const token = await ethers.getContractAt("MockToken", tokenAddress);
    const decimals = await token.decimals();
    let tx = await token.mint(toAddress, ethers.utils.parseUnits("10000000", decimals));
    await tx.wait();
    console.log("Current balance:", (await token.balanceOf(toAddress)).toString());
  }
}

if (require.main === module) {
  main()
}

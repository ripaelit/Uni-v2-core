import {expect} from 'chai';
import {ethers} from 'hardhat';
import {Contract} from "ethers"

describe('TestContract', () => {
  let contract: Contract;

  beforeEach(async () => {
    const SecretContractV2 = await ethers.getContractFactory('SecretContractV2');
    contract = await SecretContractV2.deploy();
    await contract.deployed();
  });

  describe('Test SecretContractV2', async () => {
    it('testExpiration should be failed without set expiration', async () => {
      await expect(contract.testExpiration()).to.be.revertedWith("Expirable: Expired")
    })
    it('testExpiration should be failed after expiration', async () => {
      const blockNumBefore = await ethers.provider.getBlockNumber()
      const blockBefore = await ethers.provider.getBlock(blockNumBefore)
      const timestampBefore = blockBefore.timestamp
      await contract.setExpirationTime(timestampBefore)
      await expect(contract.testExpiration()).to.be.revertedWith("Expirable: Expired")
    })
    it('testExpiration', async () => {
      const blockNumBefore = await ethers.provider.getBlockNumber()
      const blockBefore = await ethers.provider.getBlock(blockNumBefore)
      const expirationTimestamp = blockBefore.timestamp + 1000000
      await contract.setExpirationTime(expirationTimestamp)
      await expect(contract.testExpiration()).to.emit(contract, "TestExpiration")
    })
  });
});

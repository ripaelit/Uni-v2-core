import {expect} from 'chai';
import {ethers} from 'hardhat';
import {Contract} from "ethers"
import {SignerWithAddress} from '@nomiclabs/hardhat-ethers/signers';

describe('TestContract', () => {
  let contract: Contract;

  before(async () => {
    const TestContract = await ethers.getContractFactory('TestContract');
    contract = await TestContract.deploy();
    await contract.deployed();
  });

  describe('Test TestContract', async () => {
    it.only('getByteCodeHash', async () => {
      const byteCodeHash = await contract.getByteCodeHash();
      console.log({byteCodeHash});
    });
    it('pairFor', async () => {
      const factory = "0xA5528d3E00C7EF4010d89154eCc4153106474eD6";
      const tokenA = "0xc2132D05D31c914a87C6611C10748AEb04B58e8F";
      const tokenB = "0x1790711d78E636e186312A89b93ae38eF6204aA5";
      const pair = await contract.pairFor(factory, tokenA, tokenB);
      console.log({pair});
    })
  });
});

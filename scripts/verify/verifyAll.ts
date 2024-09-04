import { verifyAll } from '../utils/deployUtils';

export default async function main() {
  // 1  Verify OracleContract
  // 2  Verify OracleContractV2
  // 3  Verify SecretContract
  // 4  Verify FairSwapFactory
  // 5  Verify FairSwapRouter

  // const txIds:number[] = [1,2,3,4,5];
  const txIds:number[] = [2,5];
  await verifyAll(txIds);
}

if (require.main === module) {
  main()
}

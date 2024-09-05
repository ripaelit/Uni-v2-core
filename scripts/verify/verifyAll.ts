import { verifyAll } from '../utils/deployUtils';

export default async function main() {
  await verifyAll();
}

if (require.main === module) {
  main()
}

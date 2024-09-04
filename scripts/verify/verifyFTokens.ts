import {verifyFTokens} from '../utils/deployUtils'

export default async function main() {
  await verifyFTokens()
}

if (require.main === module) {
  main()
}

//setMerkleRoot
import { ethers } from "hardhat";

const CONTRACT_ADDRESS = "0x9e7E48707cf39514DADB48b6fc9716f6ee7cC94b";

async function main() {
  //const [signer] = await ethers.getSigners(); // Người gọi mint

  // get contract
  const contract = await ethers.getContractAt("WhitelistSale", CONTRACT_ADDRESS);

  // setMerkleRoot
  const tx = await contract.setWhitelistEndTime(1753052163);

  console.log("setWhitelistEndTime... tx:", tx.hash);
  await tx.wait();
  console.log("setWhitelistEndTime thành công!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

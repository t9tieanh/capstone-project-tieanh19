//setMerkleRoot
import { ethers } from "hardhat";

const CONTRACT_ADDRESS = "0x16265D6E371a6dA3a53Ba8fe60e13Cc5a1782442";

async function main() {
  //const [signer] = await ethers.getSigners(); // Người gọi mint

  // get contract
  const contract = await ethers.getContractAt("NFTMerkleWhitelist", CONTRACT_ADDRESS);

  // setMerkleRoot
  const tx = await contract.setWhitelistEndTime(1753225524);

  console.log("setWhitelistEndTime... tx:", tx.hash);
  await tx.wait();
  console.log("setWhitelistEndTime thành công!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

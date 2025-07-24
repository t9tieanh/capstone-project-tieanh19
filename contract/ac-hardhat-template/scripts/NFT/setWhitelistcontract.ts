//setMerkleRoot
import { ethers } from "hardhat";

const CONTRACT_ADDRESS = "0x54d037127BC8f2fEf32C3febDe268618596A07e9";

async function main() {
  //const [signer] = await ethers.getSigners(); // Người gọi mint

  // get contract
  const contract = await ethers.getContractAt("NFT", CONTRACT_ADDRESS);

  // setMerkleRoot
  const tx = await contract.setWhitelistContract('0x9e7E48707cf39514DADB48b6fc9716f6ee7cC94b');

  console.log("setWhitelistContract... tx:", tx.hash);
  await tx.wait();
  console.log("setWhitelistContract thành công!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

//setMerkleRoot
import { ethers } from "hardhat";
import keccak256 from "keccak256";
import { MerkleTree } from "merkletreejs";

const CONTRACT_ADDRESS = "0x9e7E48707cf39514DADB48b6fc9716f6ee7cC94b";

async function main() {
  const [signer] = await ethers.getSigners(); // Người gọi mint
  const userAddress = await signer.getAddress();
  console.log(`Using wallet: ${userAddress}`);

  const whitelistAddresses = [
    "0x3d6a96d41f4331B97A814CEF25407278b79e3BE8",
    "0x94337fc24282E73C298D173ecAe43B4ef2B1074d",
    "0x65cFbdF39A00a183c874ddf1e01B6d0B554BA3Ba",
  ];

  // Tạo Merkle Tree
  const leafNodes = whitelistAddresses.map(addr => keccak256(addr.toLowerCase()));
  const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });

  // Tạo merkleRoot
  const merkleRoot = merkleTree.getRoot().toString("hex");

  console.log("merkleRoot:", merkleRoot);

  // get contract
  const contract = await ethers.getContractAt("WhitelistSale", CONTRACT_ADDRESS);

  // setMerkleRoot
  const tx = await contract.setMerkleRoot("0x" + merkleRoot);

  console.log("setMerkleRoot... tx:", tx.hash);
  await tx.wait();
  console.log("setMerkleRoot thành công!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

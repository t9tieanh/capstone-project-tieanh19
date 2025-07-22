import { ethers } from "hardhat";
import keccak256 from "keccak256";
import { MerkleTree } from "merkletreejs";

const CONTRACT_ADDRESS = "0xf2F4de35844474E6EbED57E257d9AE0f7BffF9D3";

async function main() {
  const [signer] = await ethers.getSigners(); // Người gọi mint
  const userAddress = await signer.getAddress();
  console.log(`Using wallet: ${userAddress}`);

  const whitelistAddresses = [
    "0x3d6a96d41f4331B97A814CEF25407278b79e3BE8",
    "0x94337fc24282E73C298D173ecAe43B4ef2B1074d",
    "0x65cFbdF39A00a183c874ddf1e01B6d0B554BA3Ba",
    "0x9D03A5a01DDe849503fc7C759672048E990E71Ec"
  ];

  // Tạo Merkle Tree
  const leafNodes = whitelistAddresses.map(addr => keccak256(addr.toLowerCase()));
  const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });

  // Tạo proof cho người dùng đang mint
  const claimingLeaf = keccak256(userAddress.toLowerCase());
  const hexProof = merkleTree.getHexProof(claimingLeaf);

  console.log("Merkle Proof:", hexProof);

  // get contract
  const contract = await ethers.getContractAt("NFTMerkleWhitelist", CONTRACT_ADDRESS);

  // Thực hiện mint
  const tx = await contract.mint(1, hexProof, {
    value: ethers.parseEther("0.0001")
  });

  console.log("Minting... tx:", tx.hash);
  await tx.wait();
  console.log("Mint thành công!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

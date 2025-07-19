import { ethers } from "hardhat";
import { NFTWhitelist } from "../typechain"; 

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying NFTWhitelist with account:", deployer.address);

  const name = "NFT Game";
  const symbol = "NFTG";

  const nftFactory = await ethers.getContractFactory("NFTWhitelist");
  const nft: NFTWhitelist = await nftFactory.deploy(name, symbol);
  await nft.waitForDeployment();

  console.log("NFTWhitelist deployed at:", await nft.getAddress());

  const cost = await nft.cost();
  console.log("Minting cost (wei):", cost.toString());
}

main().catch((error) => {
  console.error("Deployment failed:", error);
  process.exitCode = 1;
});

import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import keccak256 from "keccak256";
import { MerkleTree } from "merkletreejs";
import { ethers } from "hardhat";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  console.log("Deploying MintConfig...");

  // 1. Prepare Merkle Root from whitelist addresses
  const whitelistAddresses = [
    "0x3d6a96d41f4331B97A814CEF25407278b79e3BE8",
    "0x94337fc24282E73C298D173ecAe43B4ef2B1074d",
    "0x65cFbdF39A00a183c874ddf1e01B6d0B554BA3Ba",
    "0x9D03A5a01DDe849503fc7C759672048E990E71Ec",
    deployer, // Add the deployer to the whitelist for testing
  ];

  const leafNodes = whitelistAddresses.map((addr) => keccak256(addr.toLowerCase()));
  const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });
  const merkleRoot = merkleTree.getRoot();

  console.log("Generated Merkle Root:", "0x" + merkleRoot.toString("hex"));

  // 2. Define other constructor parameters
  const cost = ethers.parseEther("0.0001"); // 0.0001 ETH
  const maxSupply = 20;
  const maxPerWallet = 3;
  // Set whitelist end time to 1 hour from now for testing
  const whitelistEndTime = Math.floor(Date.now() / 1000) + 3600; 

  // 3. Deploy the contract
  await deploy("MintConfig", {
    from: deployer,
    log: true,
    args: [
        deployer, // initialOwner
        cost,
        maxSupply,
        maxPerWallet,
        merkleRoot,
        whitelistEndTime,
    ],
  });

  console.log("MintConfig deployed successfully.");
};

export default func;
func.tags = ["MintConfig", "deploy-2"];

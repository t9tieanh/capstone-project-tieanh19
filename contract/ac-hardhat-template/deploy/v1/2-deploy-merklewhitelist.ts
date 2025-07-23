import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import keccak256 from "keccak256";
import { MerkleTree } from "merkletreejs";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts, ethers } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  console.log("===============================");
  console.log(`Deploying to network: ${hre.network.name}`);
  console.log("===============================");

  console.log("Generating Merkle Tree...");
  const whitelistAddresses = [
    "0x3d6a96d41f4331B97A814CEF25407278b79e3BE8",
    "0x94337fc24282E73C298D173ecAe43B4ef2B1074d",
    "0x65cFbdF39A00a183c874ddf1e01B6d0B554BA3Ba",
    "0x9D03A5a01DDe849503fc7C759672048E990E71Ec"
  ];

  const leafNodes = whitelistAddresses.map(addr =>
    keccak256(addr.toLowerCase())
  );
  const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });
  const merkleRoot = merkleTree.getRoot().toString("hex");

  console.log("Merkle Root:", "0x" + merkleRoot);

  // Define constructor parameters
  const nftName = "Merkle Whitelist NFT";
  const nftSymbol = "MWLNFT";
  const cost = ethers.parseEther("0.0001");
  const maxSupply = 20;
  const maxPerWallet = 3;
  const baseURI =
    "https://687144367ca4d06b34b9e592.mockapi.io/metadata/";

  await deploy("NFTMerkleWhitelist", {
    contract: "NFTMerkleWhitelist",
    from: deployer,
    args: [
      nftName,
      nftSymbol,
      cost,
      maxSupply,
      maxPerWallet,
      baseURI,
      "0x" + merkleRoot, // Merkle root must be 0x-prefixed
      1753391124
    ],
    log: true,
    autoMine: true
  });
};

func.tags = ["deploy-2"];
export default func;

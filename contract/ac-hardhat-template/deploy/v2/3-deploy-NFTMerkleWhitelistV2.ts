import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy, get } = deployments;
  const { deployer } = await getNamedAccounts();

  console.log("Deploying NFTMerkleWhitelistV2...");

  // 1. Get the deployed instances of MerkleHelper and MintConfig
  const merkleHelper = await get("MerkleHelper");
  const mintConfig = await get("MintConfig");

  console.log(`Using MerkleHelper at: ${merkleHelper.address}`);
  console.log(`Using MintConfig at: ${mintConfig.address}`);

  // 2. Define other constructor parameters for the NFT
  const nftName = "Whitelist NFT V2";
  const nftSymbol = "WLNV2";
  const initialBaseURI = "https://687144367ca4d06b34b9e592.mockapi.io/metadata/";

  // 3. Deploy the main NFT contract
  await deploy("NFTMerkleWhitelistV2", {
    from: deployer,
    log: true,
    args: [
        nftName,
        nftSymbol,
        mintConfig.address,
        merkleHelper.address,
        initialBaseURI,
    ],
  });

  console.log("NFTMerkleWhitelistV2 deployed successfully.");
};

export default func;
func.tags = ["NFTMerkleWhitelistV2", "deploy-3"];
func.dependencies = ["MerkleHelper", "MintConfig"]; // This ensures MerkleHelper and MintConfig are deployed first

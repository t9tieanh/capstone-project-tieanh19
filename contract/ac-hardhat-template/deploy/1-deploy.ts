import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  console.log("====================");
  console.log(`Deploying to network: ${hre.network.name}`);
  console.log("====================");

  console.log("==========================");
  console.log("Deploying NFTWhitelist Contract");
  console.log("==========================");

  // Define constructor parameters
  const nftName = "Whitelist_NFT";
  const nftSymbol = "WLNFT";
  const cost = hre.ethers.parseEther("0.0001"); 
  const maxSupply = 20;
  const maxPerWallet = 3;
  const baseURI = "https://687144367ca4d06b34b9e592.mockapi.io/metadata/";

  await deploy("NFTWhitelist", {
    contract: "NFTWhitelist",
    args: [nftName, nftSymbol, cost, maxSupply, maxPerWallet, baseURI],
    from: deployer,
    log: true,
    autoMine: true, 
    skipIfAlreadyDeployed: false,
  });
};

func.tags = ["deploy-1"];
export default func;

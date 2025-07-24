import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts, ethers } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  console.log("Deploying NFT...");

  const name = "MyNFT";
  const symbol = "MNFT";
  const baseURI = "https://687144367ca4d06b34b9e592.mockapi.io/metadata/";

  const nftDeployment = await deploy("NFT", {
    from: deployer,
    log: true,
    args: [name, symbol, baseURI],
  });

  console.log("NFT deployed to:", nftDeployment.address);
};

export default func;
func.tags = ["NFT", "deploy-5"];

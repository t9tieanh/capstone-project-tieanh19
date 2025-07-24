import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  console.log("Deploying MerkleHelper...");

  await deploy("MerkleHelper", {
    from: deployer,
    log: true,
    args: [],
  });

  console.log("MerkleHelper deployed successfully.");
};

export default func;
func.tags = ["MerkleHelper", "deploy-4"];

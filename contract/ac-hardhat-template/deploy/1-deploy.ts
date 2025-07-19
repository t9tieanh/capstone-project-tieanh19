import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  console.log("====================");
  console.log(hre.network.name);
  console.log("====================");

  console.log("==========================");
  console.log("Deploy NFTWhitelist Contract");
  console.log("==========================");

  const nftName = "Whitelist NFT";
  const nftSymbol = "WLNFT";

  await deploy("NFTWhitelist", {
    contract: "NFTWhitelist",
    args: [nftName, nftSymbol],
    from: deployer,
    log: true,
    autoMine: true,
    skipIfAlreadyDeployed: false,
  });
};

func.tags = ["deploy"];
export default func;

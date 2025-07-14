import { ERC721_ABI, contractAddress } from "~/config/contract";
import { ethers } from "ethers";

let callContract = null;

const getCallContract = (provider) => {
  if (!callContract) {
    callContract = new ethers.Contract(contractAddress, ERC721_ABI, provider);
  }
  return callContract;
}

const getBalanceOf = async (provider, account) => {
  const contract = getCallContract(provider);
  try {
    const balance = await contract.balanceOf(account);
    return balance.toString();
  } catch (error) {
    console.error("Error fetching balance:", error);
    throw error;
  }
}

const getTokenURI = async (provider, tokenId) => {
  const contract = getCallContract(provider);
  try {
    const owner = await contract.tokenURI(tokenId);
    return owner;
  } catch (error) {
    console.error("Error fetching owner:", error);
    throw error;
  }
}

const callContractService = {
  getBalanceOf,
  getTokenURI
}

export default callContractService;

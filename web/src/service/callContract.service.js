import { ERC721_ABI, contractAddress } from "~/config/contract";
import { ethers } from "ethers";
import { parseEther } from "ethers";
import { pricePerToken } from "~/config/contract";

let readContract = null;
let writeContract = null;

const getReadContract = (provider) => {
  if (!readContract) {
    readContract = new ethers.Contract(contractAddress, ERC721_ABI, provider);
  }
  return readContract;
}

const getWriteContract = (signer) => {
  if (!writeContract) {
    writeContract = new ethers.Contract(contractAddress, ERC721_ABI, signer);
  }
  return writeContract;
}

const getBalanceOf = async (provider, account) => {
  const contract = getReadContract(provider);
  const balance = await contract.balanceOf(account);
  return balance.toString();
}

const getTokenURI = async (provider, tokenId) => {
  const contract = getReadContract(provider);
  const owner = await contract.tokenURI(tokenId);
  return owner;
}

const mintNFT = async (signer, amount) => {
  const contract = getWriteContract(signer);

  // giá mỗi token là 0.01 ETH
  const pricePerNFT = parseEther(pricePerToken);
  // eslint-disable-next-line no-undef
  const totalPrice = pricePerNFT * BigInt(amount);

  const tx = await contract.mint(amount, {
      value: totalPrice
  });

  await tx.wait();
}

const getTokenCount = async (provider) => {
  const contract = getReadContract(provider);
  return await contract.nextTokenId();
}


const getOwnerOfToken = async (provider, tokenId) => {
  const contract = getReadContract(provider);
  return await contract.ownerOf(tokenId);
}


const addUserToWhitelist = async (signer, userAddress) => {
  const contract = getWriteContract(signer)
  const tx = await contract.addToWhitelist(userAddress);
  return await tx.wait(); // đợi tx được mine
}


const getOwnerOfContract = async(provider) => {
  const contract = getReadContract(provider);
  return await await contract.owner();
}


const callContractService = {
  getBalanceOf,
  getTokenURI,
  mintNFT,
  getTokenCount,
  getOwnerOfToken,
  addUserToWhitelist,
  getOwnerOfContract
}

export default callContractService;

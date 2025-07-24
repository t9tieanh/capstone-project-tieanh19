import ERC721_ABI from './abi.json'
export const contractAddress = '0xf2F4de35844474E6EbED57E257d9AE0f7BffF9D3'

export { ERC721_ABI };

// số lượng NFT tối đa có thể mint
export const maxSupply = 20;

// số lượng NFT tối đa mà một ví có thể sở hữu
export const maxPerWallet = 3;

export const pricePerToken = '0.0001'; // giá mỗi token là 0.0001 ETH

// ---- các exception code của contract ----
export const NFT_ERRORS = Object.freeze({
  NOT_WHITELISTED: "Not whitelisted",
  AMOUNT_MUST_BE_GREATER_THAN_ZERO: "Amount must be greater than 0",
  MAX_SUPPLY_EXCEEDED: "Exceeds max supply",
  MAX_PER_WALLET_EXCEEDED: "Exceeds max per wallet",
  NOT_ENOUGH_ETH: "Insufficient ETH",
  INVALID_MERKLE_PROOF: "Invalid Merkle Proof"
});
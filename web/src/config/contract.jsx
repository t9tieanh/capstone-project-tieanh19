export const contractAddress = '0x7226460fcdf12c6f5dbfd2596E6a2e6EF8f4eEe6'

export const ERC721_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function ownerOf(uint256 tokenId) view returns (address)',
  'function tokenURI(uint256 tokenId) view returns (string)',
  'function mint(uint256 amount) external payable',
  'function nextTokenId() view returns (uint256)',
  'function addToWhitelist(address user) external',
  'event AddedToWhitelist(address user)',
  'function owner() view returns (address)'
]

// số lượng NFT tối đa có thể mint
export const maxSupply = 20;

// số lượng NFT tối đa mà một ví có thể sở hữu
export const maxPerWallet = 3;

export const pricePerToken = '0.0001'; // giá mỗi token là 0.0001 ETH

// ---- các exception code của contract ----
export const NFT_ERRORS = Object.freeze({
  NOT_WHITELISTED: "Not whitelisted",
  AMOUNT_MUST_BE_GREATER_THAN_ZERO: "Amount must > 0",
  MAX_SUPPLY_EXCEEDED: "Max supply exceeded",
  MAX_PER_WALLET_EXCEEDED: "Max per wallet exceeded",
  NOT_ENOUGH_ETH: "Not enough ETH"
});
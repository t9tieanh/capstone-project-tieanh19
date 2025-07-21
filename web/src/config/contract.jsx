export const contractAddress = '0x59bA0667668C9Ac5F3C8FEE88E522554778688c3'

export const ERC721_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function ownerOf(uint256 tokenId) view returns (address)',
  'function tokenURI(uint256 tokenId) view returns (string)',
  'function mint(uint256 amount) external payable',
  'function totalSupply() view returns (uint256)',
  'function addToWhitelist(address user) external',
  'event AddedToWhitelist(address user)',
  'function owner() view returns (address)',
  'function withdraw() external'
];

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
  NOT_ENOUGH_ETH: "Insufficient ETH"
});
// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.10;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";


/// @title erc 721 training project
/// @author kaoutar sougrati

contract MyDVYNFT is ERC721, Ownable {
    
    uint public MAX_SUPPLY;
    ERC20 public tokenAddress;

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    mapping(uint => uint) tokenLevels;

    string public URI; //"ipfs://bafybeichcwo7tsmglu4rbtpoliiz2iwwq6st7r2hcfuxiqkpu2t5mwq6iq/"
    
    /// @param tokenAddr is the address of the DVT smart contract
    constructor(address tokenAddr , string memory tokenURI) ERC721("Devy", "DVY") {
        tokenAddress = ERC20(tokenAddr);
        MAX_SUPPLY = 100;
        URI = tokenURI;
    }
    
    /// @dev the ipfs link bellow is generated after uploading erc721 tokens metadata to ipfs
    /// @return ipfs URI
    function _baseURI() internal view virtual override returns (string memory) {
        return URI;
    }
    
    /// @param tokenId The id of the token
    /// @param level The new level within the tokenID
    function updateTokenLevel(uint tokenId, uint level) external onlyOwner returns (bool){
        tokenLevels[tokenId] = level;
        return true;
    }

    /// @dev transfers a erc721 token to msg sender, the id is auto incremented
    function mint() public {
        uint newTokenId = _tokenIdCounter.current();
        require(newTokenId < MAX_SUPPLY, "Can't mint anymore tokens.");
        
        require(tokenAddress.transferFrom(msg.sender, address(this), 2 * 10**5 * tokenLevels[newTokenId]), "transfer fails");
    
        _safeMint(msg.sender, newTokenId);
        _tokenIdCounter.increment();
    }

    function tokenURI(uint256 tokenId) public view override(ERC721) returns (string memory) {
        require(_exists(tokenId),"ERC721Metadata: URI query for nonexistent token");

        return bytes(_baseURI()).length > 0 ? string(abi.encodePacked(_baseURI(), Strings.toString(tokenId))) : "";
	}

    // function printTokenLevel(uint token) external view returns (uint) {
    //     return tokenLevels[token];
    // }


}

//https://ipfs.io/ipfs/bafybeichcwo7tsmglu4rbtpoliiz2iwwq6st7r2hcfuxiqkpu2t5mwq6iq/1
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";


import "@openzeppelin/contracts-upgradeable/utils/cryptography/MerkleProofUpgradeable.sol";

/// @title erc 20 upgradable version 1
/// @author kaoutar sougrati

contract V2_MyDVTTokenUpgradeable is Initializable, ERC20Upgradeable, OwnableUpgradeable {
    
    uint public _totalSupply;
    
    uint public pricePerTkn;
    address public teamWallet;
    address public marketingWallet;
    address public bountyWallet;

    bytes32 public merkleRoot;

    uint beginDate;
        
    uint _supply;

    function initialize() external initializer {
        __ERC20_init("DevTkn", "DVT");
        __Ownable_init();
        _totalSupply = 1000000;
    
        teamWallet=0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2;
        marketingWallet=0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db;
        bountyWallet=0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB;

        merkleRoot = 0xefba05821be36bf49febe3ec3641d18babe9d575f4daecf9ece544acdce2e014;

        beginDate = 1661986800; //begin date in seconds 01/09/2022

        _supply = _totalSupply * (10 ** decimals() );

        _mint(teamWallet, (_supply * 5)/100);
        _mint(marketingWallet,(_supply * 3)/100);
        _mint(bountyWallet, (_supply * 2)/100);
        _mint(address(this), _supply - totalSupply());  
    }
    
    /// @dev this function sets the decimals for our token
    function decimals() public view virtual override returns (uint8) {
        return 6;
    }

    /// @dev this is a payable function that transfers amount of erc20 to the msg sender
    /// @param amount The desired amount of the ERC20 token
    function publicSale(uint amount) payable external {
        pricePerTkn = 0.4 ether;
        require(amount <= ERC20Upgradeable(address(this)).balanceOf(address(this)), "Not enough tokens in the reserve");
       
        require(msg.value == amount*pricePerTkn, "what you sent didn't match the actual cost");
        require(block.timestamp > beginDate + 2 days,"public sale begins after the private sale ends");        
        
        _transfer(address(this),msg.sender,amount * (10 ** decimals()));
    }


    /// @dev this is a payable function that transfers amount of erc721 to the msg sender
    /// @param amount The desired amount of the ERC721 token
    /// @param _merkleProof the proof that the user is whitelisted
    function privateSale(uint amount, bytes32[] calldata _merkleProof,uint endDate) payable external {
        pricePerTkn = 0.2 ether;

        bytes32 leaf = keccak256(abi.encodePacked(msg.sender));
        require(MerkleProofUpgradeable.verify(_merkleProof, merkleRoot, leaf), "Invalid Merkle Proof");


        require(amount <= ERC20Upgradeable(address(this)).balanceOf(address(this)), "Not enough tokens in the reserve");
        require(msg.value == amount*pricePerTkn, "what you sent didn't match the actual cost");
        require(block.timestamp <= endDate && block.timestamp >= beginDate,"delay exceeded");   

        _transfer(address(this),msg.sender,amount* (10 ** decimals()));
       
    }

    /// @dev this function transfers the balance of the addresse to the owner of the contract
    function withdraw() external onlyOwner {
        payable(msg.sender).transfer(address(this).balance);
    }

    /// @notice only owner can set the root
    /// @dev this function sets the old merkleroot to a new one
    /// @param mr the new merkle root
    function setMerkleRoot(bytes32 mr) external onlyOwner {
        merkleRoot = mr;
    }

    function getContractVersion() public pure returns(uint8) {
        return 2;
    } 

}

//0xa513E6E4b8f2a923D98304ec87F64353C4D5C853
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Deploy", function () {
    
    let myDVTToken;
    let hardhatFToken;
    let myDVYNFT;
    let hardhatNFToken;
    let owner;

    
    it("Should deploy the token and test total supply", async function () {
        
        [owner] = await ethers.getSigners();
    
        myDVTToken = await ethers.getContractFactory("MyDVTToken");
        hardhatFToken = await myDVTToken.deploy();

        myDVYNFT = await ethers.getContractFactory("MyDVYNFT");
        hardhatNFToken = await myDVYNFT.deploy(hardhatFToken.address,"ipfs://bafybeichcwo7tsmglu4rbtpoliiz2iwwq6st7r2hcfuxiqkpu2t5mwq6iq/");

        expect(await hardhatFToken.totalSupply()).to.equal(1000000000000);
        expect(await hardhatFToken.owner()).to.equal(owner.address);

    });


    it("Should deploy the NFT", async function () {

        [owner] = await ethers.getSigners();
    
        myDVTToken = await ethers.getContractFactory("MyDVTToken");
        hardhatFToken = await myDVTToken.deploy();

        myDVYNFT = await ethers.getContractFactory("MyDVYNFT");
        hardhatNFToken = await myDVYNFT.deploy(hardhatFToken.address,"ipfs://bafybeichcwo7tsmglu4rbtpoliiz2iwwq6st7r2hcfuxiqkpu2t5mwq6iq/");

        expect(await hardhatNFToken.tokenAddress()).to.equal(hardhatFToken.address);
        expect(await hardhatNFToken.MAX_SUPPLY()).to.equal(100);
        expect(await hardhatNFToken.owner()).to.equal(owner.address);
        expect(await hardhatNFToken.URI()).to.equal("ipfs://bafybeichcwo7tsmglu4rbtpoliiz2iwwq6st7r2hcfuxiqkpu2t5mwq6iq/");


    });


});

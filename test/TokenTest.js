const { expect } = require("chai");
const { ethers } = require("hardhat");
  
describe("Tokens", function () {
  
    let owner;
    let NotOwner;
    let myDVTToken;
    let hardhatFToken;
    let myDVYNFT;
    let hardhatNFToken;
    

    beforeEach("create instances", async function() {
        [owner,NotOwner] = await ethers.getSigners();

        myDVTToken = await ethers.getContractFactory("MyDVTToken");
        hardhatFToken = await myDVTToken.deploy();

        
        myDVYNFT = await ethers.getContractFactory("MyDVYNFT");
        hardhatNFToken = await myDVYNFT.deploy(hardhatFToken.address,"ipfs://bafybeichcwo7tsmglu4rbtpoliiz2iwwq6st7r2hcfuxiqkpu2t5mwq6iq/");

    });

    describe("NFT functionalities",function(){

        it("Should update the nft level for creator", async function () {

            expect(await hardhatNFToken.connect(owner).updateTokenLevel(1,1)).not.to.be.true;
        });

        it("Should not update the nft level for non-creator", async function () {

            await expect(hardhatNFToken.connect(NotOwner).updateTokenLevel(1,1)).to.be.revertedWith("Ownable: caller is not the owner");
        });

        it("Should return the token URI", async function () {

            await hardhatFToken.connect(NotOwner).publicSale(2,{value: ethers.utils.parseUnits('0.8', 'ether')});
            
            await hardhatNFToken.connect(NotOwner).mint();

            expect(await hardhatNFToken.tokenURI(0)).to.equal("ipfs://bafybeichcwo7tsmglu4rbtpoliiz2iwwq6st7r2hcfuxiqkpu2t5mwq6iq/0");
        })

    });

    describe("Withdraw", function () {
        it("Should withdraw to owner", async function () {

            const contractBalance = await ethers.provider.getBalance(hardhatFToken.address);

            expect(await hardhatFToken.connect(owner).withdraw()).not.to.be.reverted;
            expect(Number(ethers.utils.formatEther(owner.address))).to.equal(Number(ethers.utils.formatEther(owner.address))+Number(ethers.utils.formatEther(contractBalance)));
        });

        it("Should not withdraw to Non-owner", async function () {

            await expect(hardhatFToken.connect(NotOwner).withdraw()).to.be.revertedWith("Ownable: caller is not the owner");

        });
    });


    describe("merkle", function () {
        it("Should not set merkle root for Non-owner", async function () {

            await expect(hardhatFToken.connect(NotOwner).setMerkleRoot("0xf5548685a3599ae7260e41b9192db0ae303152801d30a7b20acadf04fba48ddf")).to.be.revertedWith("Ownable: caller is not the owner");
        });

        it("Should set merkle root for owner", async function () {

            expect(await hardhatFToken.connect(owner).setMerkleRoot("0xf5548685a3599ae7260e41b9192db0ae303152801d30a7b20acadf04fba48ddf")).not.to.be.reverted;
            expect(await hardhatFToken.merkleRoot()).to.equal("0xf5548685a3599ae7260e41b9192db0ae303152801d30a7b20acadf04fba48ddf");
        });

    });



    describe("sales", function () {
        it("Should pass the public sale", async function () {

            await hardhatFToken.connect(NotOwner).publicSale(2,{value: ethers.utils.parseUnits('0.8', 'ether')});

            const contractBalance = await ethers.provider.getBalance(hardhatFToken.address);

            expect(await hardhatFToken.balanceOf(NotOwner.address)).to.equal(2000000);
            expect(await contractBalance).to.equal(800000000000000000n);
        
        });

        it("Should pass the private sale when delay is still up", async function () {
            
           // console.log(NotOwner.address);

            // getting timestamp
            const blockNum = await ethers.provider.getBlockNumber();
            const block = await ethers.provider.getBlock(blockNum);
            const timestamp = block.timestamp;
           
            await hardhatFToken.connect(NotOwner).privateSale(2, [
                '0xdfbe3e504ac4e35541bebad4d0e7574668e16fefa26cd4172f93e18b59ce9486',
                '0x39a01635c6a38f8beb0adde454f205fffbb2157797bf1980f8f93a5f70c9f8e6'
                ],timestamp+172800,{value: ethers.utils.parseUnits('0.4', 'ether')});

            const contractBalance = await ethers.provider.getBalance(hardhatFToken.address);

            expect(await hardhatFToken.balanceOf(NotOwner.address)).to.equal(2000000);
            expect(await contractBalance).to.equal(400000000000000000n);
          
        });

        it("private sale should fail as merkleProof not valid", async function(){
            // getting timestamp
            const blockNum = await ethers.provider.getBlockNumber();
            const block = await ethers.provider.getBlock(blockNum);
            const timestamp = block.timestamp;
           
            await expect (hardhatFToken.connect(NotOwner).privateSale(2, [
                '0xdfbe3e504ac4e35541bebad4d0e7574668e16fefa26cd4172f93e18b59ce9486',
                '0x39a01635c6a38f8beb0adde454f205fffbb2157797bf1FFFFFFFFFFFFFFFFFFF'
                ],timestamp+172800,{value: ethers.utils.parseUnits('0.4', 'ether')})).to.be.revertedWith("Invalid Merkle Proof");

        });


        it("Should fail the private sale when block.timestamp > privatesaleEndDate", async function () {
            
            // console.log(NotOwner.address);
 
             // getting timestamp
             const blockNum = await ethers.provider.getBlockNumber();
             const block = await ethers.provider.getBlock(blockNum);
             const timestamp = block.timestamp;
            
             await expect (hardhatFToken.connect(NotOwner).privateSale(2, [
                 '0xdfbe3e504ac4e35541bebad4d0e7574668e16fefa26cd4172f93e18b59ce9486',
                 '0x39a01635c6a38f8beb0adde454f205fffbb2157797bf1980f8f93a5f70c9f8e6'
                 ],timestamp-172800,{value: ethers.utils.parseUnits('0.4', 'ether')})).to.be.revertedWith("delay exceeded");
           
        });

        it("Should fail the private sale when block.timestamp < privatesaleBeginDate", async function () {
            
            // console.log(NotOwner.address);

                // getting timestamp
                const blockNum = await ethers.provider.getBlockNumber();
                const block = await ethers.provider.getBlock(blockNum);
                const timestamp = block.timestamp;
            
                await expect (hardhatFToken.connect(NotOwner).privateSale(2, [
                    '0xdfbe3e504ac4e35541bebad4d0e7574668e16fefa26cd4172f93e18b59ce9486',
                    '0x39a01635c6a38f8beb0adde454f205fffbb2157797bf1980f8f93a5f70c9f8e6'
                    ],timestamp-259200,{value: ethers.utils.parseUnits('0.4', 'ether')})).to.be.revertedWith("delay exceeded");
           
        });
 
        it("sale should fail value < token price", async function(){
           
            await expect (hardhatFToken.connect(NotOwner).publicSale(2,{value: ethers.utils.parseUnits('0.1', 'ether')})).to.be.revertedWith("what you sent didn't match the actual cost");

        });

    });

    describe("mint nft", function(){
        it("Should pass the mint function", async function () {
            
            await hardhatFToken.connect(NotOwner).publicSale(2,{value: ethers.utils.parseUnits('0.8', 'ether')});
            
            await hardhatNFToken.connect(NotOwner).mint();

            expect(await hardhatNFToken.balanceOf(NotOwner.address)).to.equal(1);
        
        });

    });
     
});
  

  
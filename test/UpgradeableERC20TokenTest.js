const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");

describe("Deploy", function () {
    
    let myDVTToken;
    let myDVTTokenV2;
    let hardhatFToken;
    let hardhatFTokenV2;
    let owner;

    beforeEach("create instances", async function() {
        [owner] = await ethers.getSigners();

        myDVTToken = await ethers.getContractFactory("MyDVTTokenUpgradeable");
        hardhatFToken = await upgrades.deployProxy(myDVTToken,{ initializer: 'initialize' });
        await hardhatFToken.deployed();

        myDVTTokenV2 = await ethers.getContractFactory("V2_MyDVTTokenUpgradeable");
        hardhatFTokenV2 = await upgrades.upgradeProxy(hardhatFToken.address,myDVTTokenV2);
        await hardhatFTokenV2.deployed();

    });

    
    
    describe("deploy", function () {
        
        it("Should deploy the token and test address", async function () {

            expect(await hardhatFTokenV2.address).to.equal(hardhatFToken.address);
            expect(await hardhatFTokenV2.getContractVersion()).to.equal(2);

        });

        it("should return the same balance as the first version of the contract", async function(){
            
            const hardhatFTokenV2Balance = await ethers.provider.getBalance(hardhatFTokenV2.address);

            const hardhatFTokenBalance = await ethers.provider.getBalance(hardhatFToken.address);

            expect(await hardhatFTokenV2Balance).to.equal(hardhatFTokenBalance);

        });

    });


});

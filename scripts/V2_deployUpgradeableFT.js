const { ethers, upgrades } = require('hardhat');

async function main () {
    const DvtV2 = await ethers.getContractFactory('V2_MyDVTTokenUpgradeable');
    console.log('Upgrading MyDVTTokenUpgradeable...');
    await upgrades.upgradeProxy('0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e', DvtV2);
    console.log('MyDVTTokenUpgradeable upgraded');
}


// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
  
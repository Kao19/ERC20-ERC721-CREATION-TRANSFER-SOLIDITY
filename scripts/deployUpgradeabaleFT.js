
const { ethers, upgrades } = require('hardhat');

async function main () {
  const Dvt = await ethers.getContractFactory('MyDVTTokenUpgradeable');
  console.log('Deploying MyDVTTokenUpgradeable...');
  const dvt = await upgrades.deployProxy(Dvt, { initializer: 'initialize' });
  await dvt.deployed();
  console.log('MyDVTToken deployed to:', dvt.address);
}


// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
  
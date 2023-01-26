// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {

  const MyDVTToken = await hre.ethers.getContractFactory("MyDVTToken");
  const myDVTToken = await MyDVTToken.deploy();

  await myDVTToken.deployed();

  console.log(
    `done`
  );

  const MyDVYNFT = await hre.ethers.getContractFactory("MyDVYNFT");
  const myNFT = await MyDVYNFT.deploy(myDVTToken.address,"ipfs://bafybeichcwo7tsmglu4rbtpoliiz2iwwq6st7r2hcfuxiqkpu2t5mwq6iq/");

  await myNFT.deployed();

  console.log(
    `done`
  );

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

require("@nomicfoundation/hardhat-toolbox");
require('@openzeppelin/hardhat-upgrades');
//require('@openzeppelin/contracts');
require("@nomiclabs/hardhat-web3");

task("balance", "Prints an account's balance")
  .addParam("account", "The account's address")
  .setAction(async (taskArgs)  => {
    const balance = await ethers.provider.getBalance(taskArgs.account);

    console.log(ethers.utils.formatEther(balance), "ETH");
  });

task("accounts", "Prints the list of accounts", async () => {
    const accounts = await ethers.getSigners();
  
    for (const account of accounts) {
      console.log(account.address);
    }
  });

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.10",
  networks:{
    // ropsten: {
    //   url: "",
    //   accounts: [""]
    // }
  }
};

// imports
const { ethers, run, network } = require("hardhat");
// async main
const main = async () => {
  const SimpleStorageFactory = await ethers.getContractFactory("SimpleStorage");
  console.log("Deploying contract...");
  const simpleStorage = await SimpleStorageFactory.deploy();
  await simpleStorage.deployed();
  console.log(`Deploy contract to: ${simpleStorage.address}`);

  console.log(network.config);
  if (network.config.chainId === 4 && process.env.ETHERSCAN_API_KEY) {
    await simpleStorage.deployTransaction.wait(6);
    await verify(simpleStorage.address, []);
  }

  const currentValue = await simpleStorage.retrieve();
  console.log(`Current Value is: ${currentValue}`);

  //Update the current value
  const transactionResponse = await simpleStorage.store(7);
  await transactionResponse.wait(1);
  const updatedValue = await simpleStorage.retrieve();
  console.log(`Updated Value is: ${updatedValue}`);
};

const verify = async (contractAddress, args) => {
  console.log("Verifying contract...");
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    });
  } catch (err) {
    if (err.message.toLowerCase().includes("Already Verified!")) {
      console.log("Already Verified!");
    } else {
      console.log(err);
    }
  }
};
// main
main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

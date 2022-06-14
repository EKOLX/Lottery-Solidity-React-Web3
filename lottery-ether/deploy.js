const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");

const { interface, bytecode } = require("./compile");

const provider = new HDWalletProvider(
  "gaze crush disease output village upgrade blast open jump cousin price inquiry",
  "https://rinkeby.infura.io/v3/0cfe005319ab4273b43dca4139eda91c"
);

// Brave Browser: prosper cup way shell genre try always music media govern crop dove

const web3 = new Web3(provider);

const deploy = async () => {
  try {
    const accounts = await web3.eth.getAccounts();

    console.log("Attempting to deploy from account", accounts[0]);

    const result = await new web3.eth.Contract(JSON.parse(interface))
      .deploy({ data: bytecode })
      .send({ from: accounts[0], gas: "1000000" });

    console.log("Contract interface:", interface);
    console.log("Contract deployed to address:", result.options.address);

    // provider.engine.stop();
  } catch (ex) {
    console.error("Exeption", ex);
  }
};

deploy();

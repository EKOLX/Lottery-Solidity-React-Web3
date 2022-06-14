import Web3 from "web3";

let web3;

if (window.ethereum && window.ethereum.isMetaMask) {
  web3 = new Web3(window.ethereum);

  window.ethereum.request({ method: "eth_requestAccounts" });
} else {
  console.log("Need to install MetaMask");
  window.Error("Please install MetaMask browser extension to interact");
}

export default web3;

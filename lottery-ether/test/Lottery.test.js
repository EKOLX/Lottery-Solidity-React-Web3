const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");

const { interface, bytecode } = require("../compile");

const web3 = new Web3(ganache.provider());

let accounts;
let lottery;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  lottery = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode })
    .send({ from: accounts[0], gas: "1000000" });
});

describe("Lottery", () => {
  it("deploys a contract", () => {
    assert.ok(lottery.options.address);
  });

  it("allows one account to enter", async () => {
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei("0.02", "ether"),
    });

    const players = await lottery.methods
      .getPlayers()
      .call({ from: accounts[0] });

    assert.equal(players.length, 1);
    assert.equal(players[0], accounts[0]);
  });

  it("allows multiple accounts to enter", async () => {
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei("0.02", "ether"),
    });
    await lottery.methods.enter().send({
      from: accounts[1],
      value: web3.utils.toWei("0.02", "ether"),
    });
    await lottery.methods.enter().send({
      from: accounts[2],
      value: web3.utils.toWei("0.02", "ether"),
    });

    const players = await lottery.methods
      .getPlayers()
      .call({ from: accounts[0] });

    assert.equal(players.length, 3);
    assert.equal(players[0], accounts[0]);
    assert.equal(players[1], accounts[1]);
    assert.equal(players[2], accounts[2]);
  });

  it("requires a minimum amount of ether to enter", async () => {
    try {
      await lottery.methods.enter().send({
        from: accounts[0],
        value: web3.utils.toWei("0.01", "ether"),
      });
      assert(false);
    } catch (ex) {
      assert(ex);
    }
  });

  it("only manager can call pickWinner", async () => {
    try {
      await lottery.methods.pickWinner().call({ from: accounts[0] });
      assert(true);
      await lottery.methods.pickWinner().call({ from: accounts[1] });
      assert(false);
    } catch (ex) {
      assert(ex);
    }
  });

  it("sends money to the winner and resets the players array", async () => {
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei("2", "ether"),
    });

    const initialBalance = await web3.eth.getBalance(accounts[0]);

    await lottery.methods.pickWinner().send({ from: accounts[0] });

    const finalBalance = await web3.eth.getBalance(accounts[0]);

    const difference = finalBalance - initialBalance;

    assert(difference > web3.utils.toWei("1.8", "ether"));
  });
});

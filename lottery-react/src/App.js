import { useEffect, useState } from "react";

import web3 from "./web3";
import lottery from "./lottery";
import "./App.css";

function App() {
  const [manager, setManager] = useState("");
  const [accounts, setAccount] = useState([]);
  const [players, setPlayers] = useState([]);
  const [balance, setBalance] = useState("");
  const [value, setValue] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    (async () => {
      const network = await web3.eth.net.getNetworkType();
      console.log("network", network);

      const _accounts = await web3.eth.getAccounts();
      setAccount(_accounts);

      const _manager = await lottery.methods.manager().call();
      const _players = await lottery.methods.getPlayers().call();
      const _balance = await web3.eth.getBalance(lottery.options.address);

      setManager(_manager);
      setPlayers(_players);
      setBalance(_balance);
    })();
  }, []);

  const onEnter = async (event) => {
    event.preventDefault();

    try {
      setMessage("Waiting on transaction to complete...");

      await lottery.methods.enter().call({
        from: accounts[0],
        value: web3.utils.toWei(value, "ether"),
      });

      setMessage("You have been entered!");
    } catch (ex) {
      console.error(ex);
      setMessage("Oops, something wrong...");
    }
  };

  const onPickWinnerClick = async () => {
    setMessage("Waiting on transaction to complete...");

    await lottery.methods.pickWinner().send({ from: accounts[0] });

    setMessage("The winner has been picked!");
  };

  return (
    <div className="App">
      <h2>Lottery Contract</h2>
      <p>
        This contract is managed by <b>{manager}</b>.<br />
        There are currently {players.length} people entered,
        <br />
        competing to win {web3.utils.fromWei(balance, "ether")} ether!
      </p>

      <hr />

      <form onSubmit={onEnter}>
        <h4> Want to try your luck?</h4>
        <div>
          <label>Amount of ether to enter</label>
          <input
            value={value}
            onChange={(event) => setValue(event.target.value)}
          />
          <button>Enter</button>
        </div>
      </form>

      <hr />

      <h4>Ready to pick a winner?</h4>
      <button onClick={onPickWinnerClick}>Pick a winner!</button>

      <hr />

      <h3>{message}</h3>
    </div>
  );
}

export default App;

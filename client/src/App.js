import React, { useEffect, useState } from "react";
import Helloabi from "./contracts/Hello.json";
import Web3 from "web3";
import Navbar from "./Navbar";
import TokenAbi from './contracts/Tokenabi.json';
import CrowdsaleAbi from './contracts/Presaleabi.json';
import "./App.css"

const App = () => {
  const [refresh, setrefresh] = useState(0);
  const [ethValue, setEthValue] = useState(0)

  let content;
  const [loading2, setloading2] = useState(false);

  const [account, setAccount] = useState("");
  const [loading, setLoading] = useState(true);
  const [Hello, setHello] = useState({});

  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [tokenDecimal, setTokenDecimal] = useState("");

  const [balanceOfuser, setBalanceofuser] = useState(0)


  const [TokenSoldInPresale, setTokenSoldInPresale] = useState(0)
  const [TokenPriceInPresale, setTokenPriceInPresale] = useState(0)
  const [TotalSupplyOfTokens, setTotalSupplyOfTokens] = useState(0)
  const [DevTokenAddressInCrowsale, setDevTokenAddressInCrowsale] = useState("")
  const [presalecontractinstance, setpresalecontractinstance] = useState({});
  const [devtokencontractinstance, setdevtokencontractinstance] = useState({});

  // Transfer hooks
  const [transfer_to_address, set_transfer_to_address] = useState("")
  const [transfer_amount, set_transfer_amount] = useState(0)

  // Approve hooks
  const [approve_amount, set_approve_amount] = useState(0)
  const [approve_address, set_approve_address] = useState("")

  // TransferFrom hooks
  const [transferfrom_address, set_transferfrom_address] = useState("");
  const [transferfrom_to_address, set_transferfrom_to_address] = useState("");
  const [transferfrom_amount, set_transferfrom_amount] = useState(0)

  // Allowance

  const [address1, setaddress1] = useState("")
  const [address2, setaddress2] = useState("")
  const [giveAllowance, setgiveAllowance] = useState("")

  const loadWeb3 = async () => {
    if (window.ethereum) {
      await window.ethereum.enable();
    } else {
      window.alert(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  };

  const loadBlockchainData = async () => {
    setLoading(true);
    if (
      typeof window.ethereum == "undefined"
    ) {
      return;
    }

    // defining the web3
    const web3 = new Web3(window.ethereum);

    let url = window.location.href;
    console.log(url);

    const accounts = await web3.eth.getAccounts();

    if (accounts.length == 0) {
      return;
    }
    setAccount(accounts[0]);
    const networkId = await web3.eth.net.getId();


    if (networkId == 97) {

      // const devTokenContract = new web3.eth.Contract(TokenAbi.abi, "0x2dd595f4807d2654b3787ff8af8594fc642ab138");
      const devTokenContract = new web3.eth.Contract(TokenAbi.abi, "0x32D4c6B5F14b704EE60377Ab3eB0E46b1246d9F5");
      setdevtokencontractinstance(devTokenContract)


      const nameoftoken = await devTokenContract.methods.name().call();
      setTokenName(nameoftoken)
      const symboloftoken = await devTokenContract.methods.symbol().call();
      setTokenSymbol(symboloftoken)
      const decimaloftoken = await devTokenContract.methods.decimals().call();
      setTokenDecimal(decimaloftoken)
      const balanceOfuser = await devTokenContract.methods.balanceOf(accounts[0]).call();
      // here I set the tokenprice to 1000
      const balanceofuserinwei = web3.utils.fromWei(balanceOfuser, "ether");
      setBalanceofuser(balanceofuserinwei);

      // PRESALE CONTRACTS
      const presalecontract = new web3.eth.Contract(CrowdsaleAbi.abi, "0xeF4c8f2fC2705e80bd16B23FFDE36493E980f488");
      setpresalecontractinstance(presalecontract)


      const tokenpriceofpresale = await presalecontract.methods.tokenprice().call();
      // const tokenpriceofpresaleinether = web3.utils.fromWei(tokenpriceofpresale, "ether");

      const totalsoldofpresale = await presalecontract.methods.totalsold().call();
      const totalsoldofpresaleinether = web3.utils.fromWei(totalsoldofpresale, 'ether');


      const totalsupplyoftoken = await devTokenContract.methods.totalSupply().call();
      const totalsupplyoftokenindecimals = web3.utils.fromWei(totalsupplyoftoken, 'ether');
      const devtokeninpresale = await presalecontract.methods.devtoken().call();


      setTokenPriceInPresale(tokenpriceofpresale)
      setTokenSoldInPresale(totalsoldofpresaleinether)

      setTotalSupplyOfTokens(totalsupplyoftokenindecimals)
      setDevTokenAddressInCrowsale(devtokeninpresale)



      const hello = {}
      setHello(hello);

      setLoading(false);

    } else {
      window.alert("the contract not deployed to detected network.");
      setloading2(true);
    }
  };

  const Allowance = async () => {
    const web3 = new Web3(window.web3);

    
    const giveallowance = await devtokencontractinstance.methods
      .allowance(address1, address2).call()

    const allowanceineth = web3.utils.fromWei(giveallowance, "ether");

    setgiveAllowance(allowanceineth);
  }

  const onBuyTransaction = async (a) => {
    const web3 = new Web3(window.web3);
    const amountinwei = web3.utils.toWei(ethValue.toString())

    await presalecontractinstance
      .methods
      .buyTokens()
      .send({ from: account, value: amountinwei })
      .once("recepient", (recepient) => {
        window.alert("transaction success");
      })
      .on("error", () => {
        window.alert("presale_contract transaction error");
      });

    // await Hello.methods
    //   .setCompleted(a.toString())
    //   .send({ from: account })
    //   .once("recepient", (recepient) => {
    //     console.log("success");
    //   })
    //   .on("error", () => {
    //     console.log("error");
    //   });
  };


  const onTransfer = async () => {
    const web3 = new Web3(window.web3);
    console.log(transfer_amount)
    const amountinwei = web3.utils.toWei(transfer_amount.toString());
    console.log(amountinwei)
    await devtokencontractinstance
      .methods
      .transfer(transfer_to_address, amountinwei)
      .send({ from: account })
      .once("recepient", (recepient) => {
        window.alert("transfer success");
      })
      .on("error", () => {
        window.alert("presale_contract transfer error");
      });
  }


  const onApprove = async () => {
    const web3 = new Web3(window.web3);
    const amountinwei = web3.utils.toWei(approve_amount.toString());

    await devtokencontractinstance
      .methods
      .approve(approve_address, amountinwei)
      .send({ from: account })
      .once("recepient", (recepient) => {
        window.alert("transfer success");
      })
      .on("error", () => {
        window.alert("presale_contract transfer error");
      });
  }

  const onTransferFrom = async () => {
    const web3 = new Web3(window.web3);
    const amountinwei = web3.utils.toWei(approve_amount.toString());

    await devtokencontractinstance
      .methods
      .transferFrom(transferfrom_address, transferfrom_to_address, transferfrom_amount)
      .send({ from: account })
      .once("recepient", (recepient) => {
        window.alert("transfer success");
      })
      .on("error", () => {
        window.alert("presale_contract transfer error");
      });
  }

  const walletAddress = async () => {
    await window.ethereum.request({
      method: "eth_requestAccounts",
      params: [
        {
          eth_accounts: {},
        },
      ],
    });
    window.location.reload();
  };

  useEffect(() => {
    loadWeb3();
    loadBlockchainData();

    if (refresh == 1) {
      setrefresh(0);
      loadBlockchainData();
    }
    //esl
  }, [refresh]);

  if (loading === true) {
    content = (
      <p className="text-center">
        Loading...{loading2 ? <div>loading....</div> : ""}
      </p>
    );
  } else {
    content = (
      <div className="container">
        <main role="main" className="container">
          <div className="jumbotron">
            <h1>CrowdSale</h1>
            <div className="row" style={{ paddingTop: "30px" }} style={{ display: "flex", flexDirection: "column" }} >
              {" "}
              <div className="row" style={{ paddingLeft: "40px" }}>
                <p>tokenname: {tokenName}</p>
              </div>
              <div className="row" style={{ paddingLeft: "40px" }}>
                <p>tokensymbol: {tokenSymbol}</p>
              </div>
              <div className="row" style={{ paddingLeft: "40px" }}>
                <p>tokenDecimal: {tokenDecimal}</p>
              </div>
              <div className="row" style={{ paddingLeft: "40px" }}>
                <p>balanceofuser: {balanceOfuser}</p>
              </div>
              <div className="row" style={{ paddingLeft: "40px" }}>
                <p>totalsupplyoftoken: {TotalSupplyOfTokens}</p>
              </div>
              <div className="row" style={{ paddingLeft: "40px" }}>
                <p>devtokensale address: <i>{DevTokenAddressInCrowsale}</i>  </p>
              </div>
              <div className="row" style={{ paddingLeft: "40px" }}>
                <p>tokenprice in presale: {TokenPriceInPresale}</p>
              </div>
              <div className="row" style={{ paddingLeft: "40px" }}>
                <p>tokensold in presale: {TokenSoldInPresale}</p>
              </div>

              {/* Buy token */}
              <div className="row" style={{ paddingLeft: "40px", marginBottom: "10px" }}>
                <h4>Buy Tokens :</h4>
                <input
                  value={ethValue}
                  placeholder='Enter the value'
                  onChange={e => setEthValue(e.target.value)}
                  type="number"
                /> <br />
                <button className="btn btn-primary" onClick={onBuyTransaction}>Buy token</button>
              </div>

              {/* transfer */}
              <div className="row" style={{ paddingLeft: "40px", marginBottom: "10px" }}>
                <h4>Transfer:</h4>
                <input
                  value={transfer_to_address}
                  placeholder='Enter the to_address'
                  onChange={e => set_transfer_to_address(e.target.value)}
                /> <br />
                <input
                  value={transfer_amount}
                  placeholder='Enter the amount'
                  onChange={e => set_transfer_amount(e.target.value)}
                  type="number"
                /> <br />
                <button className="btn btn-primary" onClick={onTransfer}>Transfer amount</button>
              </div>

              {/* Approve */}

              <div className="row" style={{ paddingLeft: "40px", marginBottom: "10px" }}>
                <h4>Approve :</h4>
                <input
                  value={approve_address}
                  placeholder='Enter the spender_address'
                  onChange={e => set_approve_address(e.target.value)}
                /> <br />
                <input
                  value={approve_amount}
                  placeholder='Enter the amount'
                  onChange={e => set_approve_amount(e.target.value)}
                  type="number"
                /> <br />
                <button className="btn btn-primary" onClick={onApprove}>Approve amount</button>
              </div>

              {/* TransferFrom */}

              <div className="row" style={{ paddingLeft: "40px", marginBottom: "10px" }}>
                <h4>TransferFrom :</h4>
                <input
                  value={transferfrom_address}
                  placeholder='From'
                  onChange={e => set_transferfrom_address(e.target.value)}
                /> <br />
                <input
                  value={transferfrom_to_address}
                  placeholder='To'
                  onChange={e => set_transferfrom_to_address(e.target.value)}
                /> <br />
                <input
                  value={transferfrom_amount}
                  placeholder='Enter the amount'
                  onChange={e => set_transferfrom_amount(e.target.value)}
                  type="number"
                /> <br />
                <button className="btn btn-primary" onClick={onTransferFrom}>Transfer</button>
              </div>
              <br />
              <br />
              <br />

              {/* Allowance */}

              <div className="row" style={{ paddingLeft: "40px", marginBottom: "10px" }}>
                <h4>Allowance :</h4>
                <input
                  value={address1}
                  placeholder='from addresss'
                  onChange={e => setaddress1(e.target.value)}
                />
                <input
                  value={address2}
                  placeholder='to address'
                  onChange={e => setaddress2(e.target.value)}
                /> <br />
                <h2>{giveAllowance}</h2>
                <button className="btn btn-primary" onClick={Allowance}>Allowance</button>
              </div>

            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div>
      <Navbar account={account} />

      {account == "" ? (
        <div className="container">
          {" "}
          Connect your wallet to application{"   "}{" "}
          <button onClick={walletAddress}>metamask</button>
        </div>
      ) : (
        content
      )}
      {/* {content} */}
    </div>
  );
};

export default App;

import WalletConnect from "@walletconnect/web3-provider";
import CoinbaseWalletSDK from "@coinbase/wallet-sdk";
import { ethers } from "ethers";
import RainbowWal from "../components/RainbowWal";
import Web3Modal from "web3modal";
import {
  hideLoader,
  resetSignatureData,
  showLoader,
  updateAcceptTradeData,
} from "../actions/actions";
import contractABI from "../abis/contract.json";
import erc721ABI from "../abis/erc721.json";
import erc1155ABI from "../abis/erc1155.json";
import weth from "../abis/weth.json";
import { useContract, useProvider, useSigner } from 'wagmi'

// const infuraId = process.env.REACT_APP_INFURA_ID;
// const providerOptions = {
//   walletconnect: {
//     package: WalletConnect,
//     options: {
//       infuraId,
//     },
//   },
//   coinbasewallet: {
//     package: CoinbaseWalletSDK,
//     options: {
//       appName: "My Awesome App",
//       infuraId,
//     },
//   },
// };

class ProviderClass {
  constructor() {
    if (!ProviderClass.instance) {
      this.dispatch = () => {};
      // this.web3Modal = new Web3Modal({
      //   network: "mainnet",
      //   cacheProvider: true,
      //   providerOptions,
      // });
      this.eProvider = null;
      this.address = null;
      this.signer = null;
      // this.chainId = null;
      this.tradeContractAddress = "0xcc15396272c2ffe333580e53c21aa5cc2b667b95";
      this.tradeContract = null;
      this.erc721Contract = null;
      this.erc1155Contract = null;
      this.wethContract = null;
      ProviderClass.instance = this;
    }
    return ProviderClass.instance;
  }

  init = (dispatch) => {
    this.dispatch = dispatch;
  };

  signMessage = async (message) => {
    return await this.signer?.signMessage(message);
  };

  getTradeContract = () => {
    if (!this.tradeContract) {
      this.tradeContract = new ethers.Contract(
        this.tradeContractAddress,
        contractABI,
        this.signer
      );
      return this.tradeContract;
    }
    return this.tradeContract;
  };

  getERC721Contract = () => {
    if (!this.erc721Contract) {
      this.erc721Contract = new ethers.Contract(
        "0x5d2bc8e0d831c55b48beb1f9c41a11dd59acb050",
        erc721ABI,
        this.signer
      );
      return this.erc721Contract;
    }
    return this.erc721Contract;
  };

  getERC1155Contract = () => {
    if (!this.erc1155Contract) {
      this.erc1155Contract = new ethers.Contract(
        "0x6029e28b1531c6b06f4c77e30616b1db4799cd6e",
        erc1155ABI,
        this.signer
      );
      return this.erc1155Contract;
    }
    return this.erc1155Contract;
  };

  getWETHContract = () => {
    if (!this.wethContract) {
      this.wethContract = new ethers.Contract(
        "0xc778417E063141139Fce010982780140Aa0cD5Ab",
        weth,
        this.signer
      );
      return this.wethContract;
    }
    return this.wethContract;
  };

  mintERC721 = async (tokenId) => {
    try {
      this.dispatch(showLoader());
      const tx = await this.erc721Contract.mint(this.address, tokenId);
      await tx.wait();
      this.dispatch(hideLoader());
      alert(`Successfully minted token Id ${tokenId}`);
    } catch (e) {
      this.dispatch(hideLoader());
      if (e?.message?.includes("ALREADY_MINTED")) {
        alert("ALREADY MINTED");
      } else {
        alert("Something went wrong");
      }
    }
  };

  checkForERC721Approval = async () => {
    try {
      this.dispatch(showLoader());
      const isApproved = await this.erc721Contract.isApprovedForAll(
        this.address,
        this.tradeContractAddress
      );
      this.dispatch(hideLoader());
      return isApproved;
    } catch (e) {
      alert("Check for ERC721 allowance failed");
      return false;
    }
  };

  checkForERC20Approval = async () => {
    try {
      this.dispatch(showLoader());
      const res = await this.wethContract.allowance(
        this.address,
        this.tradeContractAddress
      );
      this.dispatch(hideLoader());
      return parseFloat(res.toString()) > 0;
    } catch (e) {
      alert("Check for ERC20 allowance failed");
      return false;
    }
  };

  removeApprovalForERC721Transfer = async () => {
    try {
      this.dispatch(showLoader());
      await this.erc721Contract.setApprovalForAll(
        this.tradeContractAddress,
        false,
        {
          gasLimit: 100000,
        }
      );
      this.dispatch(hideLoader());
    } catch (e) {
      this.dispatch(hideLoader());
      alert("Remove Approval for ERC721 failed");
      throw e;
    }
  };

  approveForERC721Transfer = async () => {
    try {
      this.dispatch(showLoader());
      const tx = await this.erc721Contract.setApprovalForAll(
        this.tradeContractAddress,
        true,
        {
          gasLimit: 100000,
        }
      );
      await tx.wait();
      this.dispatch(hideLoader());
    } catch (e) {
      this.dispatch(hideLoader());
      alert("Approval for ERC721 failed");
      throw e;
    }
  };

  approveForERC20Transfer = async () => {
    this.dispatch(showLoader());
    try {
      const tx = await this.wethContract.approve(
        this.tradeContractAddress,
        "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
        {
          gasLimit: 100000,
        }
      );
      await tx.wait();
      this.dispatch(hideLoader());
    } catch (e) {
      this.dispatch(hideLoader());
      alert("Approval for ERC20 failed");
      throw e;
    }
  };

  createNftTrade = async (tokenId, amount, toAddress) => {
    const trade = async () => {
      this.dispatch(showLoader());
      try {
        const tx = await this.tradeContract?.createTradeIntent(
          ["0x5d2bc8e0d831c55b48beb1f9c41a11dd59acb050"],
          [ethers.utils.parseUnits(tokenId, 0)],
          [],
          [],
          [],
          ethers.utils.parseUnits(amount, 18),
          toAddress,
          ethers.utils.parseUnits("1753366502142", 0)
        );
        await tx.wait();
        this.dispatch(hideLoader());
        alert("Successfully created the trade");
      } catch (e) {
        console.log(e);
        this.dispatch(hideLoader());
        alert("Create NFT trade Failed");
      }
    };
    const isApproved = await this.checkForERC721Approval();
    if (isApproved) {
      await trade();
    } else {
      try {
        await this.approveForERC721Transfer();
        await trade();
      } catch (e) {
        console.log(e);
        this.dispatch(hideLoader());
      }
    }
  };

  acceptNftTrade = async (tokenIds, amount, receiver) => {
    const trade = async () => {
      try {
        this.dispatch(showLoader());
        const tx = await this.tradeContract?.acceptTrade(
          ["0x5d2bc8e0d831c55b48beb1f9c41a11dd59acb050"],
          tokenIds,
          [],
          [],
          [],
          amount,
          receiver,
          ethers.utils.parseUnits("1753366502142", 0),
          {
            gasLimit: 100000,
          }
        );
        await tx.wait();
        this.dispatch(hideLoader());
        alert("Successfully executed the trade");
      } catch (e) {
        console.log(e);
        this.dispatch(hideLoader());
        alert("Accept NFT trade Failed");
      }
    };
    const isApproved = await this.checkForERC20Approval();
    if (isApproved) {
      await trade();
    } else {
      try {
        await this.approveForERC20Transfer();
        await trade();
      } catch (e) {
        this.dispatch(hideLoader());
      }
    }
  };

  cancelNftTrade = async (tokenIds, amount, toAddress) => {
    try {
      this.dispatch(showLoader());
      const tx = await this.tradeContract?.cancelTrade(
        ["0x5d2bc8e0d831c55b48beb1f9c41a11dd59acb050"],
        tokenIds,
        [],
        [],
        [],
        amount,
        toAddress,
        ethers.utils.parseUnits("1753366502142", 0)
      );
      await tx.wait();
      this.dispatch(hideLoader());
      alert("Successfully cancelled the trade");
    } catch (e) {
      console.log(e);
      this.dispatch(hideLoader());
      alert("Cancelling NFT trade Failed");
    }
  };

  getAllTrades = async (initator, party) => {
    this.dispatch(showLoader());
    let eventFilter = this.tradeContract?.filters.TradeInitiated(
      null,
      null,
      null,
      null,
      null,
      null,
      initator,
      party
    );
    let events = await this.tradeContract?.queryFilter(eventFilter);
    this.dispatch(hideLoader());
    return events;
  };

  listenTradeEvent = (sender, dispatch) => {
    this.removeTradeListener();
    return this.tradeContract?.on(
      "TradeInitiated",
      (arr1, arr2, brr1, brr2, brr3, amt, inti, party, deadline) => {
        if (party == sender) {
          const tradeData = {
            args: [arr1, arr2, brr1, brr2, brr3, amt, inti, party, deadline],
          };
          dispatch(updateAcceptTradeData(tradeData));
          console.log(
            "listening trade events",
            arr1,
            ethers.utils.formatUnits(arr2[0], 0),
            brr1,
            brr2,
            brr3,
            ethers.utils.formatUnits(amt, 18),
            inti,
            party,
            ethers.utils.formatUnits(deadline, 0)
          );
        }
      }
    );
  };

  removeTradeListener = () => {
    this.tradeContract?.removeListener(
      "TradeInitiated",
      (arr1, arr2, brr1, brr2, brr3, amt, inti, party, deadline) => {
        console.log(
          "removed trade listener",
          arr1,
          arr2,
          brr1,
          brr2,
          brr3,
          amt,
          inti,
          party,
          deadline
        );
      }
    );
  };

  getBalance = async () => {
    const balance = await this.eProvider.getBalance(this.address);
    this.dispatch({ type: "UPDATE_BALANCE", balance });
    return balance;
  };

  connect = async () => {
    try {
      const provider = await this.web3Modal.connect();
      await this.subscribeProvider(provider);
      await provider.enable();

      this.eProvider = new ethers.providers.Web3Provider(provider);
      this.signer = this.eProvider.getSigner();
      const accounts = await this.eProvider.listAccounts();
      this.address = accounts[0];
      this.getTradeContract();
      this.getERC721Contract();
      this.getERC1155Contract();
      this.getWETHContract();
      this.dispatch({ type: "UPDATE_ADDRESS", address: this.address });
      // const { chainId } = await this.eProvider.getNetwork();
      // this.dispatch({ type: "UPDATE_CHAIN_ID", chainId });
    } catch (e) {
      console.log("error - ", e);
    }
  };

  subscribeProvider = async (provider) => {
    if (!provider.on) return;
    provider.on("close", () => this.resetApp());
    provider.on("accountsChanged", async (accounts) => {
      this.dispatch({ type: "UPDATE_ADDRESS", address: accounts[0] });
      this.getBalance();
      this.dispatch(resetSignatureData());
    });
    provider.on("chainChanged", async (chainId) => {
      const networkId = await provider.request({ method: "net_version" });
      this.dispatch({ type: "UPDATE_CHAIN_ID", chainId, networkId });
      this.getBalance();
    });

    provider.on("networkChanged", async (networkId) => {
      const { web3 } = this.state;
      const chainId = await provider.request({ method: "eth_chainId" });
      this.dispatch({ type: "UPDATE_CHAIN_ID", chainId, networkId });
      this.getBalance();
    });
  };

  resetApp = async () => {
    // const { web3 } = this.state;
    // if (web3 && web3.currentProvider && web3.currentProvider.close) {
    //   await web3.currentProvider.close();
    // }
    try {
      // await this.web3Modal.clearCachedProvider();
      this.dispatch({ type: "RESET_WALLET_INFO" });
      this.dispatch(resetSignatureData());
    } catch (e) {
      console.log(e);
    }
  };

  // getAccountAssets = async () => {
  //     const { address, chainId } = this.state;
  //     this.setState({ fetching: true });
  //     try {
  //       // get account balances
  //       const assets = await apiGetAccountAssets(address, chainId);

  //       await this.setState({ fetching: false, assets });
  //     } catch (error) {
  //       console.error(error); // tslint:disable-line
  //       await this.setState({ fetching: false });
  //     }
  //   };
}

const Provider = new ProviderClass();
Object.seal(Provider);
export default Provider;

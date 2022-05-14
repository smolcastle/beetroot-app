import WalletConnect from "@walletconnect/web3-provider";
import CoinbaseWalletSDK from "@coinbase/wallet-sdk";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import { resetSignatureData } from "../actions/actions";

const infuraId = process.env.REACT_APP_INFURA_ID;
const providerOptions = {
  walletconnect: {
    package: WalletConnect,
    options: {
      infuraId,
    },
  },
  coinbasewallet: {
    package: CoinbaseWalletSDK,
    options: {
      appName: "My Awesome App",
      infuraId,
    },
  },
};

class ProviderClass {
  constructor() {
    if (!ProviderClass.instance) {
      this.dispatch = () => {};
      this.web3Modal = new Web3Modal({
        network: "mainnet",
        cacheProvider: true,
        providerOptions,
      });
      this.eProvider = null;
      this.address = null;
      this.signer = null;
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

  getBalance = async () => {
    const balance = await this.eProvider.getBalance(this.address);
    this.dispatch({ type: "UPDATE_BALANCE", balance });
    console.log("balance - ", balance);
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
      this.dispatch({ type: "UPDATE_ADDRESS", address: this.address });
      console.log("accounts", accounts);
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
      await this.web3Modal.clearCachedProvider();
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

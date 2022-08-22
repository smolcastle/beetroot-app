import { ethers } from "ethers";
import {
  hideLoader,
  resetSignatureData,
  showLoader,
  updateAcceptTradeData,
} from "../actions/actions";

class ProviderClass {
  constructor() {
    if (!ProviderClass.instance) {
      this.dispatch = () => {};
      this.eProvider = null;
      this.address = null;
      this.signer = null;
      this.chainId = null;
      this.wethContract = null;
      ProviderClass.instance = this;
    }
    return ProviderClass.instance;
  }

  init = (dispatch) => {
    this.dispatch = dispatch;
  };

  signMessage = async (message, signer) => {
    this.signer = await signer
    return await this.signer?.signMessage(message);
  };

  getBalance = async () => {
    const balance = await this.eProvider.getBalance(this.address);
    this.dispatch({ type: 'UPDATE_BALANCE', balance });
    return balance;
  };

  subscribeProvider = async (provider) => {
    if (!provider.on) return;
    provider.on('close', () => this.resetApp());
    provider.on('accountsChanged', async (accounts) => {
      this.dispatch({ type: 'UPDATE_ADDRESS', address: accounts[0] });
      this.getBalance();
      this.dispatch(resetSignatureData());
    });
    provider.on('chainChanged', async (chainId) => {
      const networkId = await provider.request({ method: 'net_version' });
      this.dispatch({ type: 'UPDATE_CHAIN_ID', chainId, networkId });
      this.getBalance();
    });

    provider.on('networkChanged', async (networkId) => {
      const chainId = await provider.request({ method: 'eth_chainId' });
      this.dispatch({ type: 'UPDATE_CHAIN_ID', chainId, networkId });
      this.getBalance();
    });
  };

  resetApp = async () => {
    try {
      this.dispatch({ type: 'RESET_WALLET_INFO' });
      this.dispatch(resetSignatureData());
    } catch (e) {
      console.log(e);
    }
  };
}

const Provider = new ProviderClass();
Object.seal(Provider);
export default Provider;

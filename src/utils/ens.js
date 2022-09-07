import { ethers } from 'ethers';
import seaport from '../utils/seaport';
import { showPopUp } from '../actions/actions';

export async function toEthAddress(addressOrEns, dispatch) {
  if (addressOrEns.endsWith('.eth')) {
    var address = await seaport.provider.resolveName(addressOrEns);
    if (address) {
      return address;
    } else {
      dispatch(showPopUp('alert', "Bad ENS: can't resolve to address"));
      return false;
    }
  } else if (ethers.utils.isAddress(addressOrEns)) {
    return ethers.utils.getAddress(addressOrEns);
  } else {
    dispatch(showPopUp('alert', 'Invalid Ethereum address or ENS'));

    return false;
  }
}

export async function toEns(address, dispatch) {
  if (ethers.utils.isAddress(address)) {
    var name = await seaport.provider.lookupAddress(address);
    return name;
  } else {
    dispatch(showPopUp('alert', 'Invalid Ethereum address'));

    return false;
  }
}

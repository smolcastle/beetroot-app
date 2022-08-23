import { ethers } from 'ethers';
import seaport from '../utils/seaport';

export async function toEthAddress(addressOrEns) {
  if (addressOrEns.endsWith(".eth")) {
    var address = await seaport.provider.resolveName(addressOrEns);
    if (address) {
      return address
    } else {
      alert("Bad ENS: can't resolve to address")
      return false
    }
  } else if (ethers.utils.isAddress(addressOrEns)) {
    return ethers.utils.getAddress(addressOrEns)
  } else {
    alert('Invalid Ethereum address or ENS');
    return false
  }
}
const initialState = {
  address: '',
  chainId: null,
  networkId: null,
  balance: 0
};

export default function Reducer(state = initialState, action) {
  switch (action.type) {
    case 'UPDATE_WALLET_INFO': {
      const { address, chainId, networkId, balance } = action;
      return { ...state, address, chainId, networkId, balance };
    }
    case 'UPDATE_ADDRESS': {
      const { address } = action;
      return { ...state, address };
    }
    case 'UPDATE_CHAIN_ID': {
      const { chainId, networkId } = action;
      return { ...state, chainId, networkId };
    }
    case 'UPDATE_BALANCE': {
      const { balance } = action;
      return { ...state, balance };
    }
    case 'RESET_WALLET_INFO': {
      return { ...initialState };
    }
    default:
      return state;
  }
}

import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultWallets
} from '@rainbow-me/rainbowkit';
import {
  chain,
  configureChains,
  createClient
} from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';

const RainbowWal = () => {

  const { chains, provider } = configureChains(
    [ chain.mainnet ],
    [ publicProvider()]
  );

  const { connectors } = getDefaultWallets({
    appName: 'My RainbowKit App',
    chains
  });

  const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider
  })

  return (
    {wagmiClient, chains, provider}
  )
}

export default RainbowWal

import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import {
  chain,
  configureChains,
  createClient,
  WagmiConfig,
} from 'wagmi';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';

import React from 'react'

function RainbowWal() {
    const { chains, provider } = configureChains(
        [ chain.rinkeby ],
        [ publicProvider() ]
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

      return {wagmiClient, chains}
}

export default RainbowWal

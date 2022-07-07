
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import Home from "./pages/Home";
import {
  RainbowKitProvider,
  lightTheme
} from '@rainbow-me/rainbowkit';
import {
  WagmiConfig,
} from 'wagmi';
import RainbowWal from "./components/RainbowWal";

const rainbow = RainbowWal()

function App() {

  return (
  <WagmiConfig client={rainbow.wagmiClient}>
      <RainbowKitProvider chains={rainbow.chains} theme={lightTheme({
      accentColor: '#983E5B',
      accentColorForeground: 'white',
    })}>
        <Home />
      </RainbowKitProvider>
    </WagmiConfig>
  )
}

export default App;

import { useEffect } from "react";
import { useDispatch } from "react-redux";
// import './App.css'
import Home from "./pages/Home";
import Provider from "./utils/Provider";
import {
  RainbowKitProvider,
  darkTheme
} from '@rainbow-me/rainbowkit';
import {
  WagmiConfig,
} from 'wagmi';
// import wagmiClient from "./components/RainbowWal";
import RainbowWal from "./components/RainbowWal";

const rainbow = RainbowWal()

function App() {
  Provider.init(useDispatch());
  useEffect(() => {
    if (Provider.web3Modal.cachedProvider) {
      Provider.connect();
    }
  }, []);

  return (
  <WagmiConfig client={rainbow.wagmiClient}>
      <RainbowKitProvider chains={rainbow.chains} theme={darkTheme()}>
        <Home />
      </RainbowKitProvider>
    </WagmiConfig>
  )
}

export default App;

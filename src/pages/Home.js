import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route } from "react-router-dom";
import { getEthPrice, getFloorPrices } from "../actions/actions";
import { Blockies } from "../components/Blockies";
import Lists from "../components/List";
import Navigation from "../components/Navigation";
import Search from "../components/Search";
import SideNav from "../components/SideNav";
import SortOptions from "../components/SortOptions";
import ThemeBtn from "../components/ThemeBtn";
import PortfolioValue from "../components/PortfolioValue";
import { getCollectionsService } from "../services/services";
import Provider from "../utils/Provider";
import CollectionDetail from "./CollectionDetail";
import Holdings from "./Holdings";
import LandingPage from "./LandingPage";
import PnL from "./PnL";
import Channel from "../components/Chat/Channel";
import Chat from "./Chat";
import LoaderOverlay from "../components/LoaderOverlay";
import Chats from "./Chats";

const WalletButton = () => {
  const address = useSelector((state) => state.wallet.address);

  if (address) return <Blockies address={address} />;

  return (
    <button
      onClick={Provider.connect}
      type="button"
        className="py-2 text-white0 text-[12px] w-20 h-10 md:text-[12px] md:w-24 lg:w-40 mr-4 font-termina"
    >
      {"Connect Wallet"}
    </button>
  );
};

const Logo = () => {
  return (
    <div class="dark:text-white3 text-black5 font-medium text-4xl flex items-center">
      {"Beetroot"}
    </div>
  );
};

const Header = () => {
  return (
    <div className="flex items-center h-16 bg-white0 dark:bg-black2 shadow-sm px-6 flex-shrink-0">
      <Logo />
      <div className="w-16" />

      <div className="flex flex-[6_6_0%]" />
      <div className="w-[40rem] flex justify-between">
        <Navigation />
        <div className="flex flex-row items-center mr-4">
          <ThemeBtn />
          <div className="w-4" />
          <WalletButton />
        </div>
      </div>
    </div>
  );
};

const Content = () => {
  return (
    <div className="flex flex-1 flex-col h-full">
      <Header />
      <Chat />
    </div>
  );
};

const Home = () => {
  const tab = useSelector((state) => state.tabs.selectedTab);
  const dispatch = useDispatch();
  useEffect(() => {
    // dispatch(getFloorPrices());
    dispatch(getEthPrice());
    // setTimeout(() => {

    // }, 2000);
  }, []);

  return (
    <main class="flex flex-1 flex-col bg-white4 dark:bg-black7 w-screen h-screen">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/chat" element={<Content />} />
        <Route path="/chats" element={<Chats WalletButton={WalletButton} />} />
        {/* <Route path="/pnl" element={<PnL />} />
          <Route path="/collection" element={<CollectionDetail />} /> */}
      </Routes>
      <LoaderOverlay />
    </main>
  );
};

export default Home;

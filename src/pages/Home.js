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

const WalletButton = () => {
  const address = useSelector((state) => state.wallet.address);

  if (address) return <Blockies address={address} />;

  return (
    <button
      onClick={Provider.connect}
      type="button"
      class="py-2 bg-f2 dark:bg-f2 text-black3 dark:text-black3 h-10 text-base font-medium shadow-sm rounded-md w-40"
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
    <div class="flex items-center h-16 bg-white0 dark:bg-black2 shadow-sm px-6 flex-shrink-0">
      <Logo />
      <div class="w-16" />

      <div class="flex flex-[6_6_0%]" />
      <div className="w-[40rem] flex justify-between">
        <Navigation />
        <div className="flex flex-row items-center mr-4">
          <ThemeBtn />
          <div class="w-4" />
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
    <main class="flex flex-1 flex-col bg-white4 dark:bg-black7 h-screen">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/chat" element={<Content />} />
        {/* <Route path="/pnl" element={<PnL />} />
          <Route path="/collection" element={<CollectionDetail />} /> */}
      </Routes>
      <LoaderOverlay />
    </main>
  );
};

export default Home;

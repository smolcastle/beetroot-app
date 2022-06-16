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
// import Chats from "./Chats";
import LoaderOverlay from "../components/LoaderOverlay";
import {truncate } from "../helpers/Collections";
import logo2 from '../img/logo2.png' 

const WalletButton = () => {
  const address = useSelector((state) => state.wallet.address);

  // if (address) return <Blockies address={address} />;
  if (address) return <p className="text-white0">{truncate(address, 16)}</p> ;


  return (
    <button
      onClick={Provider.connect}
      type="button"
        className="py-2 text-white0 font-medium w-20 h-10 md:text-[16px] md:w-24 lg:w-40 h-12 mr-4 font-termina"
    >
      {"Connect Wallet"}
    </button>
  );
};

// const Logo = () => {
//   return (
//     <div class="dark:text-white3 text-black5 font-medium text-4xl flex items-center">
//       {"Beetroot"}
//     </div>
//   );
// };

const Header = () => {
  return (
    <div className="flex items-center h-24 bg-globaltheme shadow-sm px-6 flex-shrink-0">
      <img
          className="w-10 h-10 xs:w-12 xs:h-12 lg:w-16 lg:h-16 object-contain"
          src={logo2}
          alt=""
      />
      <div className="w-16" />

      <div className="flex flex-[6_6_0%]" />
      <div className="w-[50rem] flex justify-between items-center">
          <svg width="24" height="24" viewBox="0 0 24 24" className='mr-4' fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.9999 21.6012C13.4579 21.6012 14.6399 20.3119 14.6399 18.7215C14.6399 17.1311 13.4579 15.8418 11.9999 15.8418C10.5418 15.8418 9.35986 17.1311 9.35986 18.7215C9.35986 20.3119 10.5418 21.6012 11.9999 21.6012Z" fill="white"/>
                <path d="M10.2577 4.59101L10.2401 4.32223C10.2398 4.0586 10.2893 3.79773 10.3856 3.55589C10.4818 3.31405 10.6226 3.09642 10.7993 2.91656C10.9761 2.7367 11.1848 2.59847 11.4127 2.51047C11.6405 2.42248 11.8825 2.38662 12.1236 2.40512C12.3647 2.42363 12.5997 2.49609 12.814 2.61801C13.0283 2.73993 13.2173 2.90869 13.3691 3.11376C13.521 3.31884 13.6326 3.55584 13.6968 3.80999C13.761 4.06415 13.7766 4.33001 13.7425 4.59101C15.0187 5.00154 16.1388 5.85181 16.9351 7.01459C17.7314 8.17736 18.1612 9.59014 18.1601 11.0415V15.841C18.1601 16.0956 18.2528 16.3398 18.4178 16.5198C18.5829 16.6998 18.8067 16.8009 19.0401 16.8009C19.2735 16.8009 19.4973 16.9021 19.6623 17.0821C19.8274 17.2621 19.9201 17.5063 19.9201 17.7608C19.9201 18.0154 19.8274 18.2596 19.6623 18.4396C19.4973 18.6196 19.2735 18.7207 19.0401 18.7207H4.96008C4.72669 18.7207 4.50286 18.6196 4.33782 18.4396C4.17279 18.2596 4.08008 18.0154 4.08008 17.7608C4.08008 17.5063 4.17279 17.2621 4.33782 17.0821C4.50286 16.9021 4.72669 16.8009 4.96008 16.8009C5.19347 16.8009 5.4173 16.6998 5.58233 16.5198C5.74736 16.3398 5.84008 16.0956 5.84008 15.841V11.0415C5.83896 9.59014 6.26871 8.17736 7.06503 7.01459C7.86135 5.85181 8.98143 5.00154 10.2577 4.59101V4.59101Z" fill="white"/>
          </svg>
        <Navigation />
        <div className="flex flex-row items-center mr-4">
          {/* <ThemeBtn /> */}
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
        {/* <Route path="/chats" element={<Chats />} /> */}
        {/* <Route path="/pnl" element={<PnL />} />
          <Route path="/collection" element={<CollectionDetail />} /> */}
      </Routes>
      <LoaderOverlay />
    </main>
  );
};

export default Home;

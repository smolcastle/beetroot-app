import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Routes, Route } from 'react-router-dom';
import { getEthPrice, getFloorPrices } from '../actions/actions';
import Navigation from '../components/Navigation';
import LandingPage from './LandingPage';
import Chat from './Chat';
import LoaderOverlay from '../components/LoaderOverlay';
import logo4 from '../img/logo4.png';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Onboarding from './Onboarding';
import OnboardSuccess from './OnboardSuccess';
import { Link } from 'react-router-dom';

const WalletButton = () => {
  return <ConnectButton showBalance={false} />;
};

const Header = () => {
  return (
    <div className="flex items-center h-20 bg-white0 font-rubrik shadow-sm px-6 flex-shrink-0">
      <Link to="/" target="_blank" rel="noopener noreferrer">
        <img
          className="w-10 h-10 xs:w-12 xs:h-12 lg:w-14 lg:h-14 object-contain"
          src={logo4}
          alt="Beetroot logo"
        />
      </Link>
      <div className="w-16" />

      <div className="flex flex-[6_6_0%]" />
      <div className="w-[25rem] flex justify-between items-center">
        <Navigation />
        {/* <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8.11035 17.7969C8.47155 18.4704 9.18229 18.9284 9.99999 18.9284C10.8177 18.9284 11.5284 18.4704 11.8897 17.7969"
            stroke="#AB224E"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M6.48021 3.60052C7.41371 2.66702 8.67982 2.14258 9.99999 2.14258C11.3202 2.14258 12.5863 2.66702 13.5198 3.60052C14.4533 4.53404 14.9777 5.80014 14.9777 7.12032C14.9777 7.89711 15.1059 8.62699 15.2987 9.37358C15.3383 9.49701 15.3806 9.61536 15.4256 9.72882C15.7373 10.5166 16.679 10.7691 17.3126 11.3315C18.1087 12.0381 17.9166 13.3959 17.1859 13.9362C17.1859 13.9362 15.9574 14.9997 9.99999 14.9997C4.04259 14.9997 2.81412 13.9362 2.81412 13.9362C2.08344 13.3959 1.89135 12.0381 2.68741 11.3315C3.32099 10.7691 4.26269 10.5165 4.57449 9.72876C4.84378 9.04844 5.02227 8.19234 5.02227 7.12032C5.02227 5.80014 5.54669 4.53404 6.48021 3.60052Z"
            fill="#EED3DC"
            stroke="#AB224E"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg> */}
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
    <main className="flex flex-1 flex-col bg-white0 dark:bg-black7 w-screen h-screen">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/chat" element={<Content />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/success" element={<OnboardSuccess />} />
      </Routes>
      <LoaderOverlay />
    </main>
  );
};

export default Home;

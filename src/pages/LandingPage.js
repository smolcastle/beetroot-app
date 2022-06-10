import { useEffect, useState } from "react";
import { setUpCanvas } from "../canvas/GrainCanvas";
import "../components/wobble/wobble.css";
import { initWobble } from "../components/wobble/wobble";
import Robot from "../components/robot/Robot";
import { WindMillLoading } from "react-loadingg";
import discord from "../img/discord.png";
import twitter from "../img/twitter.png";
import mascot from "../img/mascot.png"
import grass1 from "../img/grass1.png"
import grass2 from "../img/grass2.png"
import logo from "../img/logo.png"
import robo from "../img/robo.png";
import Music from "../components/Music";

function Line({ width, marginRight, marginTop }) {
  return (
    <svg
      width={width}
      height="9"
      viewBox={`0 0 ${width} 9`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ marginRight, marginTop }}
    >
      <path
        d="M1.84814 6.72621C88.6628 6.72621 175.353 2.45926 262.179 2.45926C278.378 2.45926 326.974 2.45926 310.775 2.45926"
        stroke="#E8B81C"
        stroke-width="3"
        stroke-linecap="round"
      />
    </svg>
  );
}

function HeaderBtn({ title }) {
  return (
    <button
      type="button"
      className="py-2 text-grey2 text-[12px] w-20 h-10 md:text-[12px] md:w-24 lg:w-32 mr-4 font-termina eye_cursor"
    >
      {title}
    </button>
  );
}
function ConnectBtn({ title }) {
  return (
    <button
      type="button"
      className="py-2 bg-beetroot1 text-white h-10 md:text-[10px] lg:text-[12px] md:w-24 lg:w-32 mr-4 font-termina eye_cursor"
    >
      {title}
    </button>
  );
}

function PlayBtn() {
  const [playing, setPlay] = useState(false);
  if (playing) {
    return (
      <button
        type="button"
        onClick={() => setPlay(false)}
        className="absolute bottom-[25%] md:bottom-[30px] left-[41%] md:left-auto md:right-[30px] bg-contain h-[50px] md:h-20 w-[100px] md:w-40 bg-playing bg-no-repeat"
      />
    );
  }
  return (
    <button
      type="button"
      onClick={() => setPlay(true)}
      className="absolute bottom-[25%] md:bottom-[30px] left-[45%] md:left-auto md:right-[30px] bg-contain h-[50px] md:h-20 w-[50px] md:w-20 bg-play bg-no-repeat"
    />
  );
}

function LandingPage() {
  // useEffect(() => {
  //   setUpCanvas();
  //   initWobble();
  // }, []);

  const [] = useState();
  const [showMenu, setShowMenu] = useState(false);

  return (
    // <div className="h-screen w-screen bg-gradient-to-b from-nord-dark1 via-nord-dark2 via-nord-dark3 to-nord-dark4 flex relative">
    <div className="h-full w-screen bg-gradient-to-r from-nord-light via-nord-dark1 to-nord-dark2 flex flex-col relative md:py-0 md:px-0">
      {/* <div className="absolute inset-y-1 right-1 md:top-32 md:bottom-12 md:right-0" /> */}
      
        <div className="flex absolute lg:left-2/4 lg:-translate-x-2/4 w-4/12 sm:w-1/6 xl:w-1/12 lg:w-2/12 justify-evenly sm:left-1/12 sm:-translate-x-5/6 bottom-[24px] sm:bottom-10 z-10 items-center">
          <img
              className="w-8 h-8 xs:w-10 xs:h-10 object-contain cursor-pointer hover:scale-110 eye_cursor"
              src={discord}
              alt=""
          />
          <a href="https://twitter.com/beetrootai" target="_blank">
            <img
              className="w-8 h-8 xs:w-10 xs:h-10 object-contain cursor-pointer hover:scale-110"
              src={twitter}
              alt=""
              />
          </a>
        </div>
      {/* <canvas id="canvas" className="absolute h-screen w-screen"></canvas> */}
      <div className="flex flex-1 flex-col">
        <div className="flex items-center h-40 w-full z-10">
          <div className="flex justify-start items-center w-full md:w-52 ml-5 sm:ml-10 sm:justify-start lg:justify-center relative">
            <img
                className="w-10 h-10 xs:w-12 xs:h-12 lg:w-16 lg:h-16 object-contain"
                src={logo}
                alt=""
            />
          </div>
          <div className="md:hidden" onClick={() => setShowMenu(!showMenu)}>
            {showMenu ? 
              <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 mr-5 stroke-beetroot1 z-30" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>  
            : 
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mr-5 stroke-beetroot1 z-30" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            }
          </div>
          <div className= {
              showMenu ? "flex flex-col md:flex md:flex-row md:relative flex-1 justify-end items-center md:pr-5 lg:pr-8 xl:pr-12" 
              :
               "hidden md:flex flex-1 justify-end items-center md:pr-5 lg:pr-8 xl:pr-12"} >
            <HeaderBtn title={"Chats"} />
            <HeaderBtn title={"Deal History"} />
            <HeaderBtn title={"About Us"} />
            <ConnectBtn title={"Connect"} />
          </div>
        </div>
        <div className="flex flex-col justify-center items-center z-10 font-inter text-gray2  md:text-3xl lg:text-4xl 2xl:text-5xl leading-[2.2rem] md:leading-[3rem] lg:leading-[4rem] 2xl:leading-[5rem] md:mt-5 lg:mt-10">
          <div className="flex flex-row text-center items-center z-10 font-bold text-[24px] xs:text-[36px] md:text-[48px] lg:text-[64px] xl:text-[72px]">
            {"Beetroot, Negotiate Deals and"}
            <br/>
            {"Swap your NFTs"}
          </div>
          <p className="text-beetroot1 leading-normal text-center text-[16px] xs:text-[18px] md:text-[20px] lg:text-[24px] mt-10 mb-5 w-10/12 xl:w-5/12 lg:w-9/12 xl:w-3/6 lg:mt-10 lg:mb-5">
            {"Beetroot is a P2P marketplace which allows users to send wallet-to-wallet messages and negotiate NFT deals securely. NFT traders can trustlessly reach out to other NFT holders to negotiate prices without revealing their true identity."}
          </p>
          <p className="text-black1 leading-normal text-center font-bold text-[14px] xs:text-[16px] w-5/6 sm:w-3/6">
            {"Powered by 🌊 "}
            <a href="https://opensea.io/blog/announcements/introducing-seaport-protocol/" target="_blank" className="underline underline-offset-4">
              {"Seaport Protocol"}
            </a>
          </p>
          <button
            type="button"
            onClick={() =>
              window.open("https://0nqh1nqio8z.typeform.com/to/pnMAiA72")
            }
            className="bg-beetroot1 font-termina font-extralight text-white text-[14px] md:text-[16px] lg:text-[18px] 2xl:text-[20px] h-[40px] md:h-[46px] lg:h-[52px] 2xl:h-[58px] w-[143px] md:w-[163px] lg:w-[184px] xl:w-[204px] mt-5 sm:mt-[40px] lg:mt-[60px] leading-[20px] hover:animate-jello"
          >
            {"Join the waitlist"}
          </button>
          <Music />
        </div>
      </div>
      <div className="absolute h-1/4 sm:h-2/6 xl:h-2/5 w-full bottom-0 ">
        <div className="flex h-full w-full relative">
          <img
            className="absolute left-0 h-full invisible lg:visible"
            src={grass1}
            alt=""
          />
          <img
            className="absolute right-0 h-full"
            src={grass2}
            alt=""
          />
          <img
            className="absolute right-0 lg:right-40 sm:right-5 h-full"
            src={mascot}
            alt=""
          />
        </div>
      </div>
    </div>
  );
}

export default LandingPage;

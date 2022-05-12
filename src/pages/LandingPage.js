import { useEffect, useState } from "react";
import { setUpCanvas } from "../canvas/GrainCanvas";
import "../components/wobble/wobble.css";
import { initWobble } from "../components/wobble/wobble";
import Robot from "../components/robot/Robot";
import { WindMillLoading } from "react-loadingg";
import dw from "../img/d_w.png";
import tw from "../img/t_w.png";
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
      className="py-2 bg-white bg-opacity-[0.12] text-white h-10 md:text-[10px] lg:text-[12px] md:w-24 lg:w-32 mr-4 font-termina eye_cursor"
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

  return (
    // <div className="h-screen w-screen bg-gradient-to-b from-nord-dark1 via-nord-dark2 via-nord-dark3 to-nord-dark4 flex relative">
    <div className="h-full w-full bg-gradient-to-b from-nord-dark1 to-nord-light flex flex-col relative px-[50px] py-[24px] md:py-0 md:px-0">
      <div className="absolute bg-mobile_mesh md:bg-mesh bg-contain left-4 inset-y-1 right-1 md:top-32 md:bottom-12 md:left-32 md:right-0 bg-no-repeat" />
      <Music />
      <div className="flex absolute right-0 md:left-16 md:right-auto bottom-[24px] md:bottom-12 z-10 items-center">
        <img
          className="w-6 md:w-7 h-4 md:h-5 rounded-full flex-shrink-0 mr-4 md:mr-6 object-contain cursor-pointer"
          src={tw}
          alt=""
        />
        <img
          className="w-5 md:w-6 h-6 md:h-7 rounded-full flex-shrink-0 mr-6 object-contain cursor-pointer"
          src={dw}
          alt=""
        />
      </div>
      {/* <canvas id="canvas" className="absolute h-screen w-screen"></canvas> */}
      <div className="flex flex-1 flex-col">
        <div className="flex h-40 w-full z-10">
          <div className="flex justify-center items-center w-full md:w-52 relative">
            <WindMillLoading size={"large"} color={"#E8B81C"} />
          </div>
          <div className="md:flex flex-1 justify-end items-center md:pr-5 lg:pr-8 xl:pr-12 hidden">
            <HeaderBtn title={"Holdings"} />
            <HeaderBtn title={"Profit / Loss"} />
            <HeaderBtn title={"Analytics"} />
            <HeaderBtn title={"Connect"} />
          </div>
        </div>
        <div className="flex flex-col justify-center items-center z-10 font-righteous text-white text-[24px] md:text-3xl lg:text-4xl xl:text-5xl leading-[2.2rem] md:leading-[3rem] lg:leading-[4rem] xl:leading-[5rem] md:mt-5 lg:mt-10">
          <div className="flex flex-row items-center">
            {"Introducing "}
            <div className="text-yellow ml-4">{"beetroot.ai"}</div>
          </div>
          <div className="flex items-center text-center md:hidden">
            {"an asset management"}
          </div>
          <div className="md:flex items-center text-center hidden">
            {"an asset management platform"}
          </div>
          <div className="flex flex-col items-end">
            <div className="flex items-center text-center md:hidden">
              {"platform for your NFTs"}
            </div>
            <div className="md:flex items-center text-center hidden">
              {"for your NFTs"}
            </div>
            <Line
              width={window.innerWidth * 0.17}
              marginRight={-25}
              marginTop={-5}
            />
          </div>
          <button
            type="button"
            onClick={() =>
              window.open("https://0nqh1nqio8z.typeform.com/to/pnMAiA72")
            }
            class="bg-green bg-opacity-[0.36] text-white text-[16px] md:text-[18px] lg:text-[20px] xl:text-[22px] h-[40px] md:h-[46px] lg:h-[52px] xl:h-[58px] w-[143px] md:w-[163px] lg:w-[184px] xl:w-[204px] mt-[52px] lg:mt-[60px] leading-[20px]"
          >
            {"Join the waitlist"}
          </button>
        </div>
        <div className="flex mb-[16%] md:mb-[15%] lg:mb-[14%] xl:mb-[12.5%] 2xl:mb-[11%] mt-auto justify-center font-termina">
          <div className="flex flex-col items-end">
            <div className="text-[20px] md:text-[25px] lg:text-[30px] xl:text-[35px] text-yellow items-center">
              {"Coming soon"}
            </div>
            <svg
              width="107"
              height="4"
              viewBox="0 0 107 4"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ marginRight: -18 }}
            >
              <path
                d="M1.5249 2.42505H104.649"
                stroke="#E8B81C"
                stroke-width="3"
                stroke-linecap="round"
              />
            </svg>
          </div>
        </div>
      </div>
      <Robot />
    </div>
  );
}

export default LandingPage;

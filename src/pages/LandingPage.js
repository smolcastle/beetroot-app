import { useEffect, useState } from "react";
import { setUpCanvas } from "../canvas/GrainCanvas";
import "../components/wobble/wobble.css";
import { initWobble } from "../components/wobble/wobble";
import Robot from "../components/robot/Robot";
import { WindMillLoading } from "react-loadingg";
import dw from "../img/d_w.png";
import tw from "../img/t_w.png";

function HeaderBtn({ title }) {
  return (
    <button
      type="button"
      class="py-2 bg-white bg-opacity-[0.12] text-white h-10 text-sm w-40 mr-4 font-termina"
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
        className="absolute bottom-10 right-10 bg-contain h-20 w-40 bg-playing bg-no-repeat"
      />
    );
  }
  return (
    <button
      type="button"
      onClick={() => setPlay(true)}
      className="absolute bottom-10 right-10 bg-contain h-20 w-20 bg-play bg-no-repeat"
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
    <div className="h-screen w-screen bg-gradient-to-b from-nord-dark1 to-nord-light flex flex-col relative">
      <div className="absolute bg-mesh bg-contain top-32 bottom-12 left-32 right-0 bg-no-repeat" />
      <PlayBtn />
      <div className="flex absolute left-16 bottom-12 z-10">
        <img
          className="w-7 h-5 rounded-full flex-shrink-0 mr-6 object-contain cursor-pointer"
          src={tw}
          alt=""
        />
        <img
          className="w-6 h-7 rounded-full flex-shrink-0 mr-6 cursor-pointer"
          src={dw}
          alt=""
        />
      </div>
      {/* <canvas id="canvas" className="absolute h-screen w-screen"></canvas> */}
      <div className="flex flex-1 flex-col">
        <div className="flex h-40 w-full pr-20 z-10">
          <div className="flex justify-center items-center w-52 relative">
            <WindMillLoading size={"large"} color={"#EBCB8B"} />
          </div>
          <div className="flex flex-1 justify-end items-center">
            <HeaderBtn title={"Holdings"} />
            <HeaderBtn title={"Profit / Loss"} />
            <HeaderBtn title={"Analytics"} />
            <HeaderBtn title={"Connect"} />
          </div>
        </div>
        <div className="flex flex-[1.5] flex-col justify-center items-center z-10 font-righteous text-white text-6xl">
          <div className="flex flex-row  h-20 items-center">
            {"Introducting "}
            <div className="text-yellow ml-4">{"beetroot.ai"}</div>
          </div>
          <div className="flex h-20 items-center">
            {"An asset management platform"}
          </div>
          <div className="flex h-20 items-center">{"for your NFTs"}</div>
          <button
            type="button"
            onClick={() => {}}
            class="py-2 bg-green bg-opacity-[0.5] text-white h-[63px] text-[24px] w-[225px] mt-28 mb-8"
          >
            {"Join the waitlist"}
          </button>
        </div>
        <div className="flex flex-1 justify-center font-termina">
          <div className="text-4xl text-yellow h-24 items-center pt-8">
            {"Coming soon"}
          </div>
        </div>
      </div>
      <Robot />
    </div>
  );
}

export default LandingPage;

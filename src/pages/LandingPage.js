import { useEffect } from 'react';
import { setUpCanvas } from '../canvas/GrainCanvas';
import '../components/wobble/wobble.css'
import { initWobble } from '../components/wobble/wobble';


function LandingPage() {

  useEffect(() => {
    setUpCanvas()
    initWobble()
  }, [])

  return (
    <div className="h-screen w-screen bg-gray1 bg-bg bg-cover flex justify-center items-center">
      <canvas id="canvas" className="absolute h-screen w-screen"></canvas>
      <div className="flex flex-col p-16 items-center">
        <div className="flex flex-row">
          <div className="text-black font-mono font-extrabold text-9xl flex flex-row">
            BEETR
            <div className="text-beetroot1">
              OO
            </div>
            T
          </div>
          <div className="h-32 w-32 rounded-full bg-black rotate-12 justify-center flex items-center text-white text-xl flex-col ml-10">
            <div className="flex flex-row">
              C
              <div className="text-beetroot1 font-extrabold">
                o
              </div>
              ming
            </div>
            <div className="flex flex-row">
              S
              <div className="text-beetroot1 font-extrabold">
                oo
              </div>
              n!
            </div>
          </div>
        </div>
        <div className="flex flex-row">
          <div className="h-64 w-96 bg-chart bg-contain bg-no-repeat bg-center" />
          <div className="flex justify-center items-center text-center flex-col">
            <div className="text-black font-mono font-extrabold text-xl flex flex-row">
              A P
              <div className="text-beetroot1 font-extrabold">
                O
              </div>
              RTF
              <div className="text-beetroot1 font-extrabold">
                O
              </div>
              LI
              <div className="text-beetroot1 font-extrabold mr-2">
                O
              </div>
              MANAGEMENT APP
            </div>
            <div className="text-black font-mono font-extrabold text-xl flex flex-row">
              F
              <div className="text-beetroot1 font-extrabold">
                O
              </div>
              R Y
              <div className="text-beetroot1 font-extrabold">
                O
              </div>
              UR NFTs.
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default LandingPage;

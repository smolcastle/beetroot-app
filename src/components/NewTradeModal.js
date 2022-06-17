import React, { useState } from 'react'

// function ShowCheckIcon({check, showCheck, isSelected}){
//     if(isSelected){
//         console.log(isSelected)
//     return (
//     <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={() => showCheck(!check)} className={`${check ? 'opacity-100' : 'opacity-0'}`}>
//         <path d="M39.9998 73.3327C58.4093 73.3327 73.3332 58.4088 73.3332 39.9993C73.3332 21.5899 58.4093 6.66602 39.9998 6.66602C21.5903 6.66602 6.6665 21.5899 6.6665 39.9993C6.6665 58.4088 21.5903 73.3327 39.9998 73.3327Z" fill="#A3BE8C"/>
//         <path d="M33.3331 48.6326L54.3331 27.6326C54.9746 27.0907 55.797 26.8109 56.6359 26.8492C57.4747 26.8874 58.2683 27.2408 58.8578 27.8388C59.4474 28.4368 59.7895 29.2352 59.8158 30.0746C59.8422 30.9139 59.5507 31.7322 58.9998 32.3659L35.6665 55.6993C35.0434 56.31 34.2056 56.6521 33.3331 56.6521C32.4606 56.6521 31.6229 56.31 30.9998 55.6993L20.9998 45.6993C20.4489 45.0655 20.1574 44.2472 20.1838 43.4079C20.2101 42.5686 20.5522 41.7701 21.1418 41.1721C21.7313 40.5741 22.5249 40.2207 23.3637 40.1825C24.2026 40.1443 25.025 40.4241 25.6665 40.9659L33.3331 48.6326Z" fill="white"/>
//     </svg>
//     )}
// }

const NewTradeModal = ({setOpenTrade, sender}) => {
    const boxes= 16
    // const [check, showCheck] = useState(false)
    const [showNFT, setShowNFT] = useState(true)
    const [showEther, setShowEther] = useState(false)
  return (
    <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto w-screen h-screen bg-black10 fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative w-1/2 h-4/5 my-4 mx-auto max-w-3xl">
          <div className="border-0 rounded-sm shadow-lg relative flex flex-col h-full w-full items-start bg-overlaybg outline-none focus:outline-none py-2 px-6">
          <button
                className="text-themepink font-bold self-end"
                type="button"
                onClick={() => setOpenTrade(false)}
              >
                <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="16.9999" cy="17" r="12" transform="rotate(-45 16.9999 17)" fill="#CA7C86"/>
                    <rect x="12.333" y="13.1816" width="1.2" height="12" transform="rotate(-45 12.333 13.1816)" fill="#2D2D2D"/>
                    <rect x="13.1812" y="21.666" width="1.2" height="12" transform="rotate(-135 13.1812 21.666)" fill="#2D2D2D"/>
                </svg>
              </button>
            
            <div className='flex font-termina text-white0 w-full justify-center'>
                <button className={`mx-10 py-2 px-6 ${showNFT ? 'bg-themepink' : ''}`} onClick={() => {setShowNFT(true); setShowEther(false)}}>NFT</button>
                <button className={`mx-10 py-2 px-6 ${showEther ? 'bg-themepink' : ''}`} onClick={() => {setShowNFT(false); setShowEther(true)}}>Token/Ether</button>
            </div>
            {showNFT && (
              <>
            <div className='flex w-full justify-between mt-10'>
                <input className='w-[50%] p-2 focus:outline-none' placeholder='Search NFT here / Contract Address ...'></input>
                <input placeholder='Token ID' className='w-[45%] p-2 focus:outline-none'></input>
            </div>
            <div className='my-10 text-white0'>
                <h2>NFTs found in {sender}'s wallet:</h2>
            </div>
            <div className='grid grid-cols-6 gap-4 grid-flow-row auto-rows-max'>
                {Array.from(Array(boxes)).map((c) => {
                        return <div key={c} className='bg-white0 w-[100px] h-[100px]'>
                            {/* <ShowCheckIcon check={check} showCheck={showCheck} isSelected={check === c} /> */}
                            <input type='checkbox' className='checkmark w-[100px] h-[100px] cursor-pointer opacity-0 checked:opacity-100 accent-green bg-white0 text-black1 rounded-full'></input>
                            </div>;
                })}
            </div></>
            )}
            {showEther && (
              <>
                <div className='flex flex-col w-full items-center mt-20'>
                  <div className='flex w-[80%] justify-start'>
                    <p className='text-white0 w-[30%]'>Ether (ETH)</p>
                    <input type='text' placeholder='Amount' className='outline-none placeholder:text-black1 p-1 bg-gray3 w-[40%] mx-10'></input>
                    <button className='border-themepink border-2 px-2 border-solid bg-black rounded-sm text-themepink font-termina cursor-pointer'>Add</button>
                  </div>
                  <div className='flex w-[80%] justify-start my-10'>
                    <p className='text-white0 w-[30%]'>Wrapped Ether (WETH)</p>
                    <input type='text' placeholder='Amount' className='outline-none placeholder:text-black1 p-1 bg-gray3 w-[40%] mx-10'></input>
                    <button className='border-themepink border-2 px-2 border-solid bg-black rounded-sm text-themepink font-termina cursor-pointer'>Add</button>
                  </div>
                </div>
              </>
            )}
            <div className="relative p-6 self-center">
              <button className="bg-themepink text-white0 py-2 px-4 rounded-sm"
                type="button"
                onClick={() => setOpenTrade(false)}>
                {"Done"}
              </button>
          </div>
          </div>
          
        </div>
      </div>
  )
}

export default NewTradeModal
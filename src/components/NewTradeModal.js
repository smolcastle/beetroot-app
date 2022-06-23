import React, { useState, useEffect } from 'react'
// import newOrder from '../utils/seaport'

const NewTradeModal = ({setOpenTrade, sender, receiver, setOffers, offers, considerations, setConsiderations, askTrade, offerTrade}) => {
    const boxes= 6
    // const [check, showCheck] = useState(false)
    const [showNFT, setShowNFT] = useState(true)
    const [showEther, setShowEther] = useState(false)
    const [nftBox, setNftBox] = useState('')
    const [etherBox, setEtherBox] = useState('')
    const [wEtherBox, setWEtherBox] = useState('')
    const [tokenId, setTokenId] = useState('')

    function onAdd(){
      if(showNFT){
        setOffers(
          [
            ...offers,
            {
              "itemType": "2",
              "token": nftBox,
              "identifierOrCriteria": tokenId,
              "startAmount": "1",
              "endAmount": "1"
            }
          ]
        )
      }
      if(showEther){
        if(etherBox !== ""){
          setOffers(
            [
              ...offers,
              {
                "itemType": "0",
                "token": null,
                "startAmount": `${etherBox} * (10**18)`,
                "endAmount": `${etherBox} * (10**18)`
              }
            ]
          )
        }
        if(wEtherBox !== ""){
          setOffers(
            [
              ...offers,
              {
                "itemType": "0",
                "token": "0xDf032Bc4B9dC2782Bb09352007D4C57B75160B15",
                "startAmount": `${wEtherBox} * (10**18)`,
                "endAmount": `${wEtherBox} * (10**18)`,
              }
            ]
          )
        }
      }
  }
    function onAdd2(){
      if(showNFT){
        setConsiderations(
          [
            ...considerations,
            {
              "itemType": "2",
              "token": nftBox,
              "identifierOrCriteria": tokenId,
              "startAmount": "1",
              "endAmount": "1",
              "recipient": sender
            }
          ]
        )
      }
      if(showEther){
        if(etherBox !== ""){
          setConsiderations(
            [
              ...considerations,
              {
                "itemType": "0",
                "token": null,
                "startAmount": `${etherBox} * (10**18)`,
                "endAmount": `${etherBox} * (10**18)`,
                "recipient": sender
              }
            ]
          )
        }
        if(wEtherBox !== ""){
          setConsiderations(
            [
              ...considerations,
              {
                "itemType": "0",
                "token": "0xDf032Bc4B9dC2782Bb09352007D4C57B75160B15",
                "startAmount": `${wEtherBox} * (10**18)`,
                "endAmount": `${wEtherBox} * (10**18)`,
                "recipient": sender
              }
            ]
          )
        }
      }
  }

  useEffect(() => {
    console.log("Offers",offers)
  }, [offers])
  useEffect(() => {
    console.log("Considerations" ,considerations)
  }, [considerations])


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
                <input className='w-[40%] p-2 focus:outline-none' placeholder='Search NFT here / Contract Address ...' onChange={(e) => setNftBox(e.target.value)} ></input>
                <input placeholder='Token ID' className='w-[35%] p-2 focus:outline-none' onChange={(e) => setTokenId(e.target.value)}></input>
                <button className="bg-themepink text-white0 py-2 px-4 rounded-sm"
                type="button"
                onClick={ offerTrade ? () => onAdd() : () => onAdd2()}>
                {"Add"}
              </button>
            </div>

            <div className='flex w-full justify-between mt-10'>
                <input className='w-[40%] p-2 focus:outline-none' placeholder='Search NFT here / Contract Address ...' onChange={(e) => setNftBox(e.target.value)} ></input>
                <input placeholder='Token ID' className='w-[35%] p-2 focus:outline-none' onChange={(e) => setTokenId(e.target.value)}></input>
                <button className="bg-themepink text-white0 py-2 px-4 rounded-sm"
                type="button"
                onClick={ offerTrade ? () => onAdd() : () => onAdd2()}>
                {"Add"}
              </button>
            </div>

            <div className='flex w-full justify-between mt-10'>
                <input className='w-[40%] p-2 focus:outline-none' placeholder='Search NFT here / Contract Address ...' onChange={(e) => setNftBox(e.target.value)} ></input>
                <input placeholder='Token ID' className='w-[35%] p-2 focus:outline-none' onChange={(e) => setTokenId(e.target.value)}></input>
                <button className="bg-themepink text-white0 py-2 px-4 rounded-sm"
                type="button"
                onClick={ offerTrade ? () => onAdd() : () => onAdd2()}>
                {"Add"}
              </button>
            </div>

            <div className='flex w-full justify-between mt-10'>
                <input className='w-[40%] p-2 focus:outline-none' placeholder='Search NFT here / Contract Address ...' onChange={(e) => setNftBox(e.target.value)} ></input>
                <input placeholder='Token ID' className='w-[35%] p-2 focus:outline-none' onChange={(e) => setTokenId(e.target.value)}></input>
                <button className="bg-themepink text-white0 py-2 px-4 rounded-sm"
                type="button"
                onClick={ offerTrade ? () => onAdd() : () => onAdd2()}>
                {"Add"}
              </button>
            </div>



            <div className='my-10 text-white0'>
              {offerTrade ? (
                <h2>NFTs found in {sender}'s wallet:</h2>
              ) : (
                <h2>NFTs found in {receiver}'s wallet:</h2>
              )}
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
                    <input type='text' placeholder='Amount' className='outline-none placeholder:text-black1 p-1 bg-gray3 w-[40%] mx-10' onChange={(e) => setEtherBox(e.target.value)}></input>
                    <button className='border-themepink border-2 px-2 border-solid bg-black rounded-sm text-themepink font-termina cursor-pointer' onClick={ offerTrade ? () => onAdd() : () => onAdd2()}>Add</button>
                  </div>
                  <div className='flex w-[80%] justify-start my-10'>
                    <p className='text-white0 w-[30%]'>Wrapped Ether (WETH)</p>
                    <input type='text' placeholder='Amount' className='outline-none placeholder:text-black1 p-1 bg-gray3 w-[40%] mx-10' onChange={(e) => setWEtherBox(e.target.value)}></input>
                    <button className='border-themepink border-2 px-2 border-solid bg-black rounded-sm text-themepink font-termina cursor-pointer' onClick={ offerTrade ? () => onAdd() : () => onAdd2()}>Add</button>
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
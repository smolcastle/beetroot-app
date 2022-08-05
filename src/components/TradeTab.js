import { parseEther } from 'ethers/lib/utils'
import React, { useState, useEffect, useRef } from 'react'
import { ethers } from "ethers";
import erc721ABI from "../abis/erc721.json";
import seaport from '../utils/seaport';
import getAsset from '../utils/opensea';

const TradeTab = ({createOrder, sender, setOffers, offers, considerations, setConsiderations, truncate, isLoading, askTrade, offerTrade, setAskTrade, setOfferTrade}) => {

    const [nftBox, setNftBox] = useState('')
    const [etherBox, setEtherBox] = useState(0)
    const [wEtherBox, setWEtherBox] = useState('')
    const [tokenId, setTokenId] = useState('')
    const [offerFor, setOfferFor] = useState("")
    const inputRef = useRef('')

    const reset = () => {
        inputRef.current.value = "";
      };


    async function onAdd() {

        const erc721Contract = new ethers.Contract(
          nftBox,
          erc721ABI,
          seaport.signer
        );

        if(tokenId){
        try {
          // will throw if tokenId doesn't exist.
          const owner = await erc721Contract.ownerOf(tokenId);
          if (owner != await seaport.signer.getAddress()) {
            alert("You are not the owner");
            return;
          }

          // TODO: use assetInfo.image_url to display image.
          // remove the owner check above if you want to test with NFTs you don't own.
          const assetInfo = await getAsset(nftBox, tokenId);
          console.log(assetInfo);

          setOffers(
            [
              ...offers,
              {
                "itemType": 2,
                "token": nftBox,
                "identifier": tokenId
              }
            ]
          )
        } catch (error) {
          console.log(error);
          alert("NFT doesn't exist");
        }
    }

        if(etherBox !== ""){
          setOffers(
            [
              ...offers,
              {
                "amount":parseEther(etherBox).toString(),
              }
            ]
          )

        }
        if(wEtherBox !== ""){
          setOffers(
            [
              ...offers,
              {
                "token": "0xDf032Bc4B9dC2782Bb09352007D4C57B75160B15",
                "amount": parseEther(wEtherBox),
              }
            ]
          )
        }
        reset()
  }

  async function onAdd2(){
      const erc721Contract = new ethers.Contract(
        nftBox,
        erc721ABI,
        seaport.signer
      );

     if(tokenId){
      try {
        // will throw if tokenId doesn't exist.
        // we are not checking for owner here as the offerer can choose
        // the order to be fulfilled by anyone.
        // TODO: discuss and check if we should do an owner check here if
        // user selects the fulfillment to be done by a particular address.
        await erc721Contract.tokenURI(tokenId);

        setConsiderations(
          [
            ...considerations,
            {
              "itemType": 2,
              "token": nftBox,
              "identifier": tokenId,
              "recipient": sender
            }
          ]
        )
      } catch (error) {
        console.log(error);
        alert("NFT details not correct");
      }
    }

      if(etherBox !== ""){
        setConsiderations(
          [
            ...considerations,
            {
              "amount": parseEther(etherBox).toString(),
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
              "token": "0xDf032Bc4B9dC2782Bb09352007D4C57B75160B15",
              "amount": parseEther(wEtherBox),
              "recipient": sender
            }
          ]
        )
      }
      reset()
  }

  useEffect(() => {
    console.log("Offers",offers)
  }, [offers])
  useEffect(() => {
    console.log("Considerations" ,considerations)
  }, [considerations])

  return (
    <>
                <div className="flex flex-col h-[95%] w-[95%] justify-evenly">
                    <div className="flex h-full w-full">
                    <div className='flex flex-col justify-evenly w-[50%] h-full'>
                        <h1 className='text-[24px] text-gum font-questa'>Trade NFTS</h1>
                        <p className='text-[12px]'>Using this feature you can create an order to trade NFTs and currency with any of your existing contacts. Do this by adding NFTs in each of the 2 carts below and then clicking ‘create order’.</p>
                        <h3 className='text-[16px]'>Your Wallet</h3>
                        <div onClick={() => {setAskTrade(false); setOfferTrade(true); reset()}} className={`flex bg-parsleytint text-parsley p-2 rounded-md justify-between ${offerTrade ? "border border-parsley border-solid" : ""}`}>
                            <p>{truncate(sender, 14)} (You)</p>
                            <button className='bg-parsleytint text-[15px]'>Clear cart</button>
                        </div>
                        <h3 className='text-[16px]'>Their Wallet</h3>
                        <p className='text-[12px]'>Paste in the field below the public address of a person you would like to trade with. You can leave this field blank if you would like this request be open to the public.</p>
                        <div onClick={() => {setAskTrade(true); setOfferTrade(false); reset()}} className={`bg-parsleytint rounded-md p-2 flex justify-between text-parsley ${askTrade ? "border border-parsley border-solid" : ""}`}>
                            <input onChange={(e) => setOfferFor(e.target.value)} placeholder='Their Wallet Address' className='outline-none bg-parsleytint placeholder-parsley'></input>
                            <button className='bg-parsleytint text-[15px]'>Clear cart</button>
                        </div>
                        <h3 className='text-[16px]'>Expiry Date</h3>
                        <p className='text-[12px]'>Leave this field blank if you would like the order request to remain active for eternity.</p>
                        <div className='flex justify-evenly  items-center text-[15px]'>
                            <input placeholder='00 MINS' className=' w-[80px] outline-none bg-parsleytint rounded-md p-2 placeholder-parsley text-parsley'></input>
                            <p>+</p>
                            <input placeholder='00.00 HRS' className='w-[100px] outline-none bg-parsleytint rounded-md p-2 placeholder-parsley text-parsley'></input>
                            <p>+</p>
                            <input placeholder='000 DAYS' className='w-[90px] outline-none bg-parsleytint rounded-md p-2 placeholder-parsley text-parsley'></input>
                        </div>
                        {!isLoading && <button className='w-full border-2 border-gum border-solid rounded-3xl text-gum h-10 font-bold mt-5 cursor-pointer'
                            onClick={
                                async () => {
                                    await createOrder(offerFor);
                                }
                            }>{"CREATE ORDER"}
                            </button>}
                            {isLoading &&
                            <button className='w-full bg-gumtint text-gum h-10 rounded-3xl mt-5 cursor-pointer flex justify-center items-center'>
                                <svg className='w-[10%]' version="1.1" id="L9" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                                viewBox="0 0 100 100" enable-background="new 0 0 0 0" xmlSpace="preserve">
                                <path fill="#AB224E" d="M73,50c0-12.7-10.3-23-23-23S27,37.3,27,50 M30.9,50c0-10.5,8.5-19.1,19.1-19.1S69.1,39.5,69.1,50">
                                    <animateTransform
                                    attributeName="transform"
                                    attributeType="XML"
                                    type="rotate"
                                    dur="1s"
                                    from="0 50 50"
                                    to="360 50 50"
                                    repeatCount="indefinite" />
                                </path>
                            </svg>
                            </button>
                            }
                    </div>
                    <div className='w-[50%] h-full ml-5'>
                        <div className='bg-parsleytint flex rounded-md items-center px-2 py-1'>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7.5714 14.2859C11.2796 14.2859 14.2856 11.2798 14.2856 7.57167C14.2856 3.86349 11.2796 0.857422 7.5714 0.857422C3.86322 0.857422 0.857147 3.86349 0.857147 7.57167C0.857147 11.2798 3.86322 14.2859 7.5714 14.2859Z" fill="#DCE5D7" stroke="#4E7B36" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M15.1429 15.1432L12.3238 12.3242" stroke="#4E7B36" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <input ref={inputRef} placeholder='Add NFTs' className='w-[60%] rounded-md outline-none bg-parsleytint p-2 placeholder-parsley text-parsley'
                            onChange={(e) => setNftBox(e.target.value)}
                        />
                        <input ref={inputRef} placeholder='Token id' className='w-[30%] rounded-md outline-none bg-parsleytint p-2 placeholder-parsley text-parsley'
                            onChange={(e) => setTokenId(e.target.value)}
                        />
                        <svg className='cursor-pointer' onClick={ offerTrade ? async () => await onAdd() : async () => await onAdd2()} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1.097 11.7358C1.27315 13.3823 2.59738 14.7065 4.24304 14.8899C6.7708 15.1717 9.22919 15.1717 11.7569 14.8899C13.4026 14.7065 14.7269 13.3823 14.903 11.7358C15.033 10.5203 15.1429 9.2725 15.1429 8.00031C15.1429 6.72814 15.033 5.4803 14.903 4.26486C14.7269 2.61841 13.4026 1.29417 11.7569 1.11073C9.22919 0.828975 6.7708 0.828975 4.24304 1.11073C2.59738 1.29417 1.27315 2.61841 1.097 4.26486C0.966956 5.4803 0.857147 6.72814 0.857147 8.00031C0.857147 9.2725 0.966957 10.5203 1.097 11.7358Z" fill="#DCE5D7" stroke="#4E7B36"/>
                                <path d="M8 5.14258V10.8569" stroke="#4E7B36" stroke-linecap="round"/>
                                <path d="M10.8571 8H5.14285" stroke="#4E7B36" stroke-linecap="round"/>
                        </svg>
                        </div>
                        <div className='flex rounded-md items-center my-3 justify-between'>
                            <div className='flex rounded-md text-parsley w-[90%] bg-parsleytint items-center px-2 py-1 justify-between'>
                            <input placeholder='Add Tokens (Ex: ETH)' className='w-[70%] outline-none bg-parsleytint p-2 placeholder-parsley text-parsley'></input>
                            <input ref={inputRef} placeholder='Amount' className='rounded-md w-[30%] outline-none bg-parsleytint p-2 placeholder-parsley text-parsley' onChange={(e) => setEtherBox(e.target.value)}></input>
                            </div>
                            <svg className='cursor-pointer' onClick={ offerTrade ? async () => await onAdd() : async () => await onAdd2()} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1.097 11.7358C1.27315 13.3823 2.59738 14.7065 4.24304 14.8899C6.7708 15.1717 9.22919 15.1717 11.7569 14.8899C13.4026 14.7065 14.7269 13.3823 14.903 11.7358C15.033 10.5203 15.1429 9.2725 15.1429 8.00031C15.1429 6.72814 15.033 5.4803 14.903 4.26486C14.7269 2.61841 13.4026 1.29417 11.7569 1.11073C9.22919 0.828975 6.7708 0.828975 4.24304 1.11073C2.59738 1.29417 1.27315 2.61841 1.097 4.26486C0.966956 5.4803 0.857147 6.72814 0.857147 8.00031C0.857147 9.2725 0.966957 10.5203 1.097 11.7358Z" fill="#DCE5D7" stroke="#4E7B36"/>
                                <path d="M8 5.14258V10.8569" stroke="#4E7B36" stroke-linecap="round"/>
                                <path d="M10.8571 8H5.14285" stroke="#4E7B36" stroke-linecap="round"/>
                            </svg>
                        </div>
                    </div>
                    </div>
                </div>
            </>
  )
}

export default TradeTab
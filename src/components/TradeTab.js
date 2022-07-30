import { parseEther } from 'ethers/lib/utils'
import React, { useState, useEffect, useRef } from 'react'
import { ethers } from "ethers";
import erc721ABI from "../abis/erc721.json";
import seaport from '../utils/seaport';

const TradeTab = ({createOrder, sender, receiver, setOffers, offers, considerations, setConsiderations, truncate, isLoading, askTrade, offerTrade, setAskTrade, setOfferTrade}) => {

    const [nftBox, setNftBox] = useState('')
    const [etherBox, setEtherBox] = useState(0)
    const [wEtherBox, setWEtherBox] = useState('')
    const [tokenId, setTokenId] = useState('')
    const [offerFor, setOfferFor] = useState(receiver)
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

  function Cart(){
    return(
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1.42859 1.07129H2.09455C3.42683 1.07129 4.58227 1.99207 4.87962 3.29075L5.65197 6.66396" stroke="#4E7B36" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M18.8607 7.8557C18.6631 9.94461 18.0707 11.683 17.5734 12.7571C17.3178 13.3091 16.8689 13.7377 16.2808 13.8927C15.5609 14.0824 14.3225 14.2859 12.3214 14.2859C10.3202 14.2859 9.08183 14.0824 8.36202 13.8927C7.77383 13.7377 7.3249 13.3091 7.06936 12.7571C6.46265 11.4465 5.71423 9.14718 5.71423 6.42871H17.4999C18.2889 6.42871 18.9349 7.07023 18.8607 7.8557Z" fill="#DCE5D7" stroke="#4E7B36" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M7.85719 19.2464C8.74018 19.2464 9.45598 18.5305 9.45598 17.6475C9.45598 16.7645 8.74018 16.0488 7.85719 16.0488C6.97422 16.0488 6.25842 16.7645 6.25842 17.6475C6.25842 18.5305 6.97422 19.2464 7.85719 19.2464Z" fill="#DCE5D7" stroke="#4E7B36" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M16.7857 19.2464C17.6687 19.2464 18.3844 18.5305 18.3844 17.6475C18.3844 16.7645 17.6687 16.0488 16.7857 16.0488C15.9027 16.0488 15.187 16.7645 15.187 17.6475C15.187 18.5305 15.9027 19.2464 16.7857 19.2464Z" fill="#DCE5D7" stroke="#4E7B36" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    )
  }
  function ClearCart(){
    return (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1.42859 1.07129H2.09455C3.42683 1.07129 4.58227 1.99207 4.87962 3.29075L5.65197 6.66396" stroke="#4E7B36" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M18.8607 7.8557C18.6631 9.94461 18.0707 11.683 17.5734 12.7571C17.3178 13.3091 16.8689 13.7377 16.2808 13.8927C15.5609 14.0824 14.3225 14.2859 12.3214 14.2859C10.3202 14.2859 9.08183 14.0824 8.36202 13.8927C7.77383 13.7377 7.3249 13.3091 7.06936 12.7571C6.46265 11.4465 5.71423 9.14718 5.71423 6.42871H17.4999C18.2889 6.42871 18.9349 7.07023 18.8607 7.8557Z" fill="#DCE5D7" stroke="#4E7B36" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M7.85719 19.2464C8.74018 19.2464 9.45598 18.5305 9.45598 17.6475C9.45598 16.7645 8.74018 16.0488 7.85719 16.0488C6.97422 16.0488 6.25842 16.7645 6.25842 17.6475C6.25842 18.5305 6.97422 19.2464 7.85719 19.2464Z" fill="#DCE5D7" stroke="#4E7B36" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M16.7857 19.2464C17.6687 19.2464 18.3844 18.5305 18.3844 17.6475C18.3844 16.7645 17.6687 16.0488 16.7857 16.0488C15.9027 16.0488 15.187 16.7645 15.187 17.6475C15.187 18.5305 15.9027 19.2464 16.7857 19.2464Z" fill="#DCE5D7" stroke="#4E7B36" stroke-linecap="round" stroke-linejoin="round"/>
        <g clip-path="url(#clip0_792_6747)">
        <path d="M12.5 10.3868C14.5547 10.3868 16.2203 8.72117 16.2203 6.66653C16.2203 4.6119 14.5547 2.94629 12.5 2.94629C10.4454 2.94629 8.77979 4.6119 8.77979 6.66653C8.77979 8.72117 10.4454 10.3868 12.5 10.3868Z" fill="#DCE5D7" stroke="#4E7B36" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M14.0874 6.66699H11.1112" stroke="#4E7B36" stroke-linecap="round"/>
        </g>
        <defs>
        <clipPath id="clip0_792_6747">
        <rect width="8.33333" height="8.33333" fill="white" transform="translate(8.33337 2.5)"/>
        </clipPath>
        </defs>
      </svg>
    )
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
                {/* <h3 className='text-[16px]'>Your Wallet</h3> */}
                <div onClick={() => {setAskTrade(false); setOfferTrade(true); reset()}} className={`flex flex-col bg-parsleytint/[0.5] text-parsley p-2 rounded-[8px] justify-between ${offerTrade ? "border-4 border-parsley/[0.5] border-solid" : ""}`}>
                    <div className='flex justify-between py-2'>
                      <p className='text-gray1 text-[12px]'>My Cart</p>
                      <div>
                      <button><Cart /></button>
                      <button className='mx-3'><ClearCart /></button>
                      </div>
                    </div>
                    <div className='flex text-[12px] bg-white0 justify-between p-3'>
                      <p>{truncate(sender, 14)}</p>
                      <button>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1.09703 11.7347C1.27318 13.3812 2.59741 14.7055 4.24308 14.8889C5.46542 15.0251 6.72046 15.1422 8.00004 15.1422C9.27961 15.1422 10.5347 15.0251 11.757 14.8889C13.4027 14.7055 14.7269 13.3812 14.903 11.7347C15.0331 10.5193 15.1429 9.27147 15.1429 7.9993C15.1429 6.72712 15.0331 5.47928 14.903 4.26384C14.7269 2.61738 13.4027 1.29314 11.757 1.10971C10.5347 0.973465 9.27961 0.856445 8.00004 0.856445C6.72046 0.856445 5.46542 0.973465 4.24308 1.10971C2.59741 1.29314 1.27318 2.61738 1.09703 4.26384C0.966987 5.47928 0.857178 6.72712 0.857178 7.9993C0.857178 9.27147 0.966988 10.5193 1.09703 11.7347Z" fill="#F2F2F2" stroke="#828282"/>
                      <path d="M8.00084 8.51756C8.00084 8.10493 8.33644 7.85183 8.92854 7.4562C9.47773 7.08923 9.76742 6.61321 9.63856 5.96539C9.50971 5.31756 8.97443 4.78229 8.32661 4.65343C7.30969 4.45115 6.33105 5.25429 6.33105 6.29112" stroke="#828282" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M8 11.3765V11.0908" stroke="#828282" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                      </button>
                    </div>
                </div>
                {/* <h3 className='text-[16px]'>Their Wallet</h3>
                <p className='text-[12px]'>Paste in the field below the public address of a person you would like to trade with. You can leave this field blank if you would like this request be open to the public.</p> */}
                <div onClick={() => {setAskTrade(true); setOfferTrade(false); reset()}} className={`flex flex-col bg-parsleytint/[0.5] text-parsley p-2 rounded-[8px] justify-between ${askTrade ? "border-4 border-parsley/[0.5] border-solid" : ""}`}>
                    {/* <input onChange={(e) => setOfferFor(e.target.value)} placeholder='Their Wallet Address' className='outline-none bg-parsleytint placeholder-parsley'></input> */}
                    <div className='flex justify-between py-2'>
                      <p className='text-gray1 text-[12px]'>Their Cart</p>
                      <div>
                      <button><Cart /></button>
                      <button className='mx-3'><ClearCart /></button>
                      </div>
                    </div>
                    <div className='flex text-[12px] bg-white0 justify-between p-3'>
                      <p>{truncate(receiver, 14)}</p>
                      <button>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1.09703 11.7347C1.27318 13.3812 2.59741 14.7055 4.24308 14.8889C5.46542 15.0251 6.72046 15.1422 8.00004 15.1422C9.27961 15.1422 10.5347 15.0251 11.757 14.8889C13.4027 14.7055 14.7269 13.3812 14.903 11.7347C15.0331 10.5193 15.1429 9.27147 15.1429 7.9993C15.1429 6.72712 15.0331 5.47928 14.903 4.26384C14.7269 2.61738 13.4027 1.29314 11.757 1.10971C10.5347 0.973465 9.27961 0.856445 8.00004 0.856445C6.72046 0.856445 5.46542 0.973465 4.24308 1.10971C2.59741 1.29314 1.27318 2.61738 1.09703 4.26384C0.966987 5.47928 0.857178 6.72712 0.857178 7.9993C0.857178 9.27147 0.966988 10.5193 1.09703 11.7347Z" fill="#F2F2F2" stroke="#828282"/>
                      <path d="M8.00084 8.51756C8.00084 8.10493 8.33644 7.85183 8.92854 7.4562C9.47773 7.08923 9.76742 6.61321 9.63856 5.96539C9.50971 5.31756 8.97443 4.78229 8.32661 4.65343C7.30969 4.45115 6.33105 5.25429 6.33105 6.29112" stroke="#828282" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M8 11.3765V11.0908" stroke="#828282" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                      </button>
                    </div>
                </div>
                <h3 className='text-[16px]'>Expiry Date</h3>
                <p className='text-[12px]'>Set a time and set at which this order request will expire. Leave field empty to let the order remain active forever. </p>
                <div className='flex justify-between items-center text-[12px] w-[60%]'>
                    <input placeholder='yyyy/mm/dd' className=' w-[90px] outline-none placeholder:text-center bg-parsleytint rounded-md p-2 placeholder-parsley text-parsley'></input>
                    <input placeholder='00.00 HRS' className='w-[80px] outline-none bg-parsleytint rounded-md p-2 placeholder-parsley text-parsley'></input>
                </div>
                {!isLoading && <button className='w-full border-[1px] border-gum border-solid rounded-[4px] text-[14px] text-gum h-10 font-bold mt-5 cursor-pointer'
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
                <div className='flex rounded-md items-center justify-between'>
                  <div className='flex rounded-md items-center bg-parsleytint p-1 w-[50%]'>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7.5714 14.2859C11.2796 14.2859 14.2856 11.2798 14.2856 7.57167C14.2856 3.86349 11.2796 0.857422 7.5714 0.857422C3.86322 0.857422 0.857147 3.86349 0.857147 7.57167C0.857147 11.2798 3.86322 14.2859 7.5714 14.2859Z" fill="#DCE5D7" stroke="#4E7B36" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M15.1429 15.1432L12.3238 12.3242" stroke="#4E7B36" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <input ref={inputRef} placeholder='NFT Collection' className='w-[80%] text-[12px] rounded-md outline-none bg-parsleytint p-2 placeholder-parsley text-parsley'
                        onChange={(e) => setNftBox(e.target.value)}
                    />
                  </div>
                  <input ref={inputRef} placeholder='Token ID' className='w-[30%] text-[12px] rounded-md outline-none bg-parsleytint p-3 placeholder-parsley text-parsley'
                      onChange={(e) => setTokenId(e.target.value)}
                  />
                  <svg className='cursor-pointer' onClick={ offerTrade ? async () => await onAdd() : async () => await onAdd2()} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1.097 11.7358C1.27315 13.3823 2.59738 14.7065 4.24304 14.8899C6.7708 15.1717 9.22919 15.1717 11.7569 14.8899C13.4026 14.7065 14.7269 13.3823 14.903 11.7358C15.033 10.5203 15.1429 9.2725 15.1429 8.00031C15.1429 6.72814 15.033 5.4803 14.903 4.26486C14.7269 2.61841 13.4026 1.29417 11.7569 1.11073C9.22919 0.828975 6.7708 0.828975 4.24304 1.11073C2.59738 1.29417 1.27315 2.61841 1.097 4.26486C0.966956 5.4803 0.857147 6.72814 0.857147 8.00031C0.857147 9.2725 0.966957 10.5203 1.097 11.7358Z" fill="#DCE5D7" stroke="#4E7B36"/>
                          <path d="M8 5.14258V10.8569" stroke="#4E7B36" stroke-linecap="round"/>
                          <path d="M10.8571 8H5.14285" stroke="#4E7B36" stroke-linecap="round"/>
                  </svg>
                </div>
                <div className='flex items-center my-3 justify-between'>
                    <div className='flex rounded-md text-parsley w-[50%] bg-parsleytint items-center px-2 py-1 justify-between'>
                      {/* <input placeholder='ETH' className='w-[70%] text-[12px] outline-none bg-parsleytint p-2 placeholder-parsley text-parsley'></input> */}
                      <select name="tokens" id="tokens" className='w-[100%] border-none focus:ring-0 text-[12px] outline-none bg-parsleytint p-2 text-parsley'>
                        <option value="ETH" className='bg-white0 text-gray1'>ETH</option>
                        <option value="WETH" className='bg-white0 text-gray1'>WETH</option>
                      </select>
                    </div>
                    <input ref={inputRef} placeholder='Amount' className='rounded-md text-[12px] w-[30%] outline-none bg-parsleytint p-3 placeholder-parsley text-parsley' onChange={(e) => setEtherBox(e.target.value)}></input>
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
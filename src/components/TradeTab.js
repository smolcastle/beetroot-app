import { parseEther } from 'ethers/lib/utils';
import React, { useState, useEffect, useRef } from 'react';
import { ethers } from 'ethers';
import erc721ABI from '../abis/erc721.json';
import seaport from '../utils/seaport';
import { getAsset, getAssetsInCollection } from '../utils/opensea';
import ReviewOrder from './ReviewOrder';
import { getDateTime } from '../helpers/Collections';
import { getMinutes, getTime } from 'date-fns';

const TradeTab = ({
  createOrder,
  sender,
  receiver,
  setOffers,
  offers,
  considerations,
  setConsiderations,
  truncate,
  isLoading,
  askTrade,
  offerTrade,
  setAskTrade,
  setOfferTrade,
  orderCreated,
  setOrderCreated
}) => {
  const { v4: uuidv4 } = require('uuid'); // to generate unique ids

  const [nftBox, setNftBox] = useState('');
  const [etherBox, setEtherBox] = useState(0);
  const [wEtherBox, setWEtherBox] = useState('');
  const [tokenId, setTokenId] = useState('');
  const [offerFor, setOfferFor] = useState('');
  const inputRef = useRef('');
  const [assetsInfo, setAssestsInfo] = useState([]);
  const [userAssets, setUserAssets] = useState([]);
  const [showHelp, setShowHelp] = useState('');
  const [reviewOrder, setReviewOrder] = useState(false);

  const reset = () => {
    inputRef.current.value = '';
  };

  async function fetchAssets() {
    try {
      const holdingAssetsInfo = await getAssetsInCollection(
        nftBox?.toLowerCase(),
        sender
      );
      setUserAssets(holdingAssetsInfo?.assets);
    } catch (e) {
      console.log('Error while fetching assets', e);
    }
  }

  useEffect(() => {
    fetchAssets();
  }, [nftBox]);

  async function addNFT(item) {
    if (item.id) {
      try {
        if (offerTrade) {
          setOffers([
            ...offers,
            {
              id: uuidv4(),
              name: item.name,
              image_url: item.image_url ? item.image_url : '',
              itemType: 2,
              token: item.asset_contract.address,
              identifier: item.id
            }
          ]);
        } else {
          setConsiderations([
            ...considerations,
            {
              id: uuidv4(),
              name: item.name,
              image_url: item.image_url ? item.image_url : '',
              itemType: 2,
              token: item.asset_contract.address,
              identifier: item.id,
              recipient: sender
            }
          ]);
        }
        setNftBox('');
        setTokenId('');
      } catch (e) {
        console.log(e);
      }
    }
  }

  async function onAddOffers() {
    const erc721Contract = new ethers.Contract(
      nftBox,
      erc721ABI,
      seaport.signer
    );

    if (tokenId) {
      // will throw if tokenId doesn't exist.
      const owner = await erc721Contract.ownerOf(tokenId);
      if (owner != (await seaport.signer.getAddress())) {
        alert('You are not the owner');
        return;
      }

      // TODO: use assetInfo.image_url to display image.
      // remove the owner check above if you want to test with NFTs you don't own.
      const assetInfo = await getAsset(nftBox, tokenId);
      setAssestsInfo(...assetsInfo, assetInfo);

      setOffers([
        ...offers,
        {
          id: uuidv4(),
          itemType: 2,
          token: nftBox,
          identifier: tokenId,
          image_url: assetInfo.image_url ? assetInfo.image_url : ''
        }
      ]);
      setNftBox('');
      setTokenId('');
    }

    if (etherBox !== 0) {
      setOffers([
        ...offers,
        {
          id: uuidv4(),
          name: 'Ethereum',
          symbol: 'ETH',
          enteredAmount: parseFloat(etherBox).toFixed(4), // convert the entered amount to decimal
          amount: parseEther(etherBox).toString()
        }
      ]);
      setEtherBox('');
      reset();
    }
    if (wEtherBox !== '') {
      setOffers([
        ...offers,
        {
          id: uuidv4(),
          name: 'Wrapped Ethereum',
          symbol: 'WETH',
          token: '0xDf032Bc4B9dC2782Bb09352007D4C57B75160B15',
          amount: parseEther(wEtherBox)
        }
      ]);
      setWEtherBox('');
      reset();
    }
  }

  async function onAddConsiderations() {
    const erc721Contract = new ethers.Contract(
      nftBox,
      erc721ABI,
      seaport.signer
    );

    if (tokenId) {
      try {
        // will throw if tokenId doesn't exist.
        // we are not checking for owner here as the offerer can choose
        // the order to be fulfilled by anyone.
        // TODO: discuss and check if we should do an owner check here if
        // user selects the fulfillment to be done by a particular address.
        await erc721Contract.tokenURI(tokenId);

        const assetInfo = await getAsset(nftBox, tokenId);
        setAssestsInfo(...assetsInfo, assetInfo);

        setConsiderations([
          ...considerations,
          {
            id: uuidv4(),
            itemType: 2,
            token: nftBox,
            identifier: tokenId,
            recipient: sender,
            image_url: assetInfo.image_url ? assetInfo.image_url : ''
          }
        ]);
      } catch (error) {
        console.log(error);
        alert('NFT details not correct');
      }
    }

    if (etherBox !== '') {
      setConsiderations([
        ...considerations,
        {
          id: uuidv4(),
          name: 'Ethereum',
          symbol: 'ETH',
          enteredAmount: parseFloat(etherBox).toFixed(4), // convert the entered amount to decimal
          amount: parseEther(etherBox).toString(),
          recipient: sender
        }
      ]);
      setEtherBox('');
      reset();
    }
    if (wEtherBox !== '') {
      setConsiderations([
        ...considerations,
        {
          id: uuidv4(),
          name: 'Wrapped Ethereum',
          symbol: 'WETH',
          token: '0xDf032Bc4B9dC2782Bb09352007D4C57B75160B15',
          amount: parseEther(wEtherBox),
          recipient: sender
        }
      ]);
      setWEtherBox('');
      reset();
    }
  }

  function Cart() {
    return (
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M1.42859 1.07129H2.09455C3.42683 1.07129 4.58227 1.99207 4.87962 3.29075L5.65197 6.66396"
          stroke="#4E7B36"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M18.8607 7.8557C18.6631 9.94461 18.0707 11.683 17.5734 12.7571C17.3178 13.3091 16.8689 13.7377 16.2808 13.8927C15.5609 14.0824 14.3225 14.2859 12.3214 14.2859C10.3202 14.2859 9.08183 14.0824 8.36202 13.8927C7.77383 13.7377 7.3249 13.3091 7.06936 12.7571C6.46265 11.4465 5.71423 9.14718 5.71423 6.42871H17.4999C18.2889 6.42871 18.9349 7.07023 18.8607 7.8557Z"
          fill="#DCE5D7"
          stroke="#4E7B36"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M7.85719 19.2464C8.74018 19.2464 9.45598 18.5305 9.45598 17.6475C9.45598 16.7645 8.74018 16.0488 7.85719 16.0488C6.97422 16.0488 6.25842 16.7645 6.25842 17.6475C6.25842 18.5305 6.97422 19.2464 7.85719 19.2464Z"
          fill="#DCE5D7"
          stroke="#4E7B36"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M16.7857 19.2464C17.6687 19.2464 18.3844 18.5305 18.3844 17.6475C18.3844 16.7645 17.6687 16.0488 16.7857 16.0488C15.9027 16.0488 15.187 16.7645 15.187 17.6475C15.187 18.5305 15.9027 19.2464 16.7857 19.2464Z"
          fill="#DCE5D7"
          stroke="#4E7B36"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  function ClearCart() {
    return (
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M1.42859 1.07129H2.09455C3.42683 1.07129 4.58227 1.99207 4.87962 3.29075L5.65197 6.66396"
          stroke="#4E7B36"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M18.8607 7.8557C18.6631 9.94461 18.0707 11.683 17.5734 12.7571C17.3178 13.3091 16.8689 13.7377 16.2808 13.8927C15.5609 14.0824 14.3225 14.2859 12.3214 14.2859C10.3202 14.2859 9.08183 14.0824 8.36202 13.8927C7.77383 13.7377 7.3249 13.3091 7.06936 12.7571C6.46265 11.4465 5.71423 9.14718 5.71423 6.42871H17.4999C18.2889 6.42871 18.9349 7.07023 18.8607 7.8557Z"
          fill="#DCE5D7"
          stroke="#4E7B36"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M7.85719 19.2464C8.74018 19.2464 9.45598 18.5305 9.45598 17.6475C9.45598 16.7645 8.74018 16.0488 7.85719 16.0488C6.97422 16.0488 6.25842 16.7645 6.25842 17.6475C6.25842 18.5305 6.97422 19.2464 7.85719 19.2464Z"
          fill="#DCE5D7"
          stroke="#4E7B36"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M16.7857 19.2464C17.6687 19.2464 18.3844 18.5305 18.3844 17.6475C18.3844 16.7645 17.6687 16.0488 16.7857 16.0488C15.9027 16.0488 15.187 16.7645 15.187 17.6475C15.187 18.5305 15.9027 19.2464 16.7857 19.2464Z"
          fill="#DCE5D7"
          stroke="#4E7B36"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <g clipPath="url(#clip0_792_6747)">
          <path
            d="M12.5 10.3868C14.5547 10.3868 16.2203 8.72117 16.2203 6.66653C16.2203 4.6119 14.5547 2.94629 12.5 2.94629C10.4454 2.94629 8.77979 4.6119 8.77979 6.66653C8.77979 8.72117 10.4454 10.3868 12.5 10.3868Z"
            fill="#DCE5D7"
            stroke="#4E7B36"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M14.0874 6.66699H11.1112"
            stroke="#4E7B36"
            strokeLinecap="round"
          />
        </g>
        <defs>
          <clipPath id="clip0_792_6747">
            <rect
              width="8.33333"
              height="8.33333"
              fill="white"
              transform="translate(8.33337 2.5)"
            />
          </clipPath>
        </defs>
      </svg>
    );
  }

  // delete offer from cart
  function removeOffer(id) {
    setOffers(offers.filter((offer) => offer.id !== id));
  }
  // delete consideration from cart
  function removeConsideration(id) {
    setConsiderations(
      considerations.filter((consideration) => consideration.id !== id)
    );
  }

  useEffect(() => {
    console.log('Offers', offers);
  }, [offers]);
  useEffect(() => {
    console.log('Considerations', considerations);
  }, [considerations]);

  const [selectOption, setSelectOption] = useState('ETH');

  function handleChange(e) {
    setSelectOption(e.target.value);
  }

  // save the new offers and considerations in local storage
  useEffect(() => {
    localStorage.setItem('offers', JSON.stringify(offers));
    localStorage.setItem('considerations', JSON.stringify(considerations));
  }, [offers, considerations]);

  function CartItems() {
    return (
      <>
        {offerTrade ? (
          <div className="cart p-2">
            {offers?.map((offer) => {
              return (
                <>
                  <div className="flex text-[12px] text-gum justify-between items-center mb-4">
                    <div className="flex flex-col justify-center">
                      {offer.name === 'Ethereum' && <p>Ethereum</p>}
                      {offer.symbol === 'ETH' && <p className="mt-2">ETH</p>}
                      <div className="flex items-center justify-between">
                        {offer.identifier && (
                          <img
                            className="w-[40px] h-[40px] rounded-[8px] mr-4"
                            src={offer.image_url}
                          />
                        )}
                        {offer.identifier && <p>{offer.name}</p>}
                      </div>
                    </div>
                    <div className="flex flex-col justify-center">
                      <svg
                        className="place-self-end cursor-pointer"
                        onClick={() => removeOffer(offer.id)}
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M0.642578 3.20996H11.3569"
                          stroke="#AB224E"
                          strokeLinecap="round"
                        />
                        <path
                          d="M9.84896 3.20996H2.14698C2.02265 5.45785 2.02459 7.6884 2.35966 9.92218C2.48336 10.7468 3.19178 11.3569 4.02568 11.3569H7.97025C8.80419 11.3569 9.51253 10.7468 9.6363 9.92218C9.97136 7.6884 9.97325 5.45785 9.84896 3.20996Z"
                          fill="#EED3DC"
                          stroke="#AB224E"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M3.8584 3.2099V2.78202C3.8584 2.2146 4.0838 1.67043 4.48503 1.2692C4.88625 0.867981 5.43042 0.642578 5.99784 0.642578C6.56525 0.642578 7.10942 0.867981 7.51064 1.2692C7.91186 1.67043 8.13727 2.2146 8.13727 2.78202V3.2099"
                          stroke="#AB224E"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M4.71484 5.50195V9.04869"
                          stroke="#AB224E"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M7.28223 5.50195V9.04869"
                          stroke="#AB224E"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <p className="mt-4">{offer.enteredAmount}</p>
                    </div>
                  </div>
                </>
              );
            })}
          </div>
        ) : (
          <div className="cart p-2">
            {considerations?.map((consideration) => {
              return (
                <>
                  <div className="flex text-[12px] text-gum justify-between items-center mb-4">
                    <div className="flex flex-col justify-center">
                      {consideration.name === 'Ethereum' && <p>Ethereum</p>}
                      {consideration.symbol === 'ETH' && (
                        <p className="mt-2">ETH</p>
                      )}
                      <div className="flex items-center justify-between">
                        {consideration.identifier && (
                          <img
                            className="w-[40px] h-[40px] rounded-[8px] mr-4"
                            src={consideration.image_url}
                          />
                        )}
                        {consideration.identifier && (
                          <p>{consideration.name}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col justify-center">
                      <svg
                        className="place-self-end cursor-pointer"
                        onClick={() => removeConsideration(consideration.id)}
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M0.642578 3.20996H11.3569"
                          stroke="#AB224E"
                          strokeLinecap="round"
                        />
                        <path
                          d="M9.84896 3.20996H2.14698C2.02265 5.45785 2.02459 7.6884 2.35966 9.92218C2.48336 10.7468 3.19178 11.3569 4.02568 11.3569H7.97025C8.80419 11.3569 9.51253 10.7468 9.6363 9.92218C9.97136 7.6884 9.97325 5.45785 9.84896 3.20996Z"
                          fill="#EED3DC"
                          stroke="#AB224E"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M3.8584 3.2099V2.78202C3.8584 2.2146 4.0838 1.67043 4.48503 1.2692C4.88625 0.867981 5.43042 0.642578 5.99784 0.642578C6.56525 0.642578 7.10942 0.867981 7.51064 1.2692C7.91186 1.67043 8.13727 2.2146 8.13727 2.78202V3.2099"
                          stroke="#AB224E"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M4.71484 5.50195V9.04869"
                          stroke="#AB224E"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M7.28223 5.50195V9.04869"
                          stroke="#AB224E"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <p className="mt-4">{consideration.enteredAmount}</p>
                    </div>
                  </div>
                </>
              );
            })}
            {considerations.length === 0 && (
              <p className="text-[12px] text-gray1">
                Counterparty’s cart is empty. Use the search bar to find and add
                NFTS.
              </p>
            )}
          </div>
        )}
      </>
    );
  }
  // get the expiry date from the input field
  const [inputExpiryDate, setInputExpiryDate] = useState(0);
  const [inputExpiryMonth, setInputExpiryMonth] = useState(0);
  const [inputExpiryYear, setInputExpiryYear] = useState(0);
  const [expiryHours, setExpiryHours] = useState(0);
  let expiryDate = 0;
  const dateObj = new Date();

  function addExpiryDate() {
    // create a date object only if the input fields are not empty
    if (
      (inputExpiryDate && inputExpiryMonth && inputExpiryYear !== 0) ||
      (inputExpiryDate &&
        inputExpiryMonth &&
        inputExpiryYear !== 0 &&
        expiryHours !== 0)
    ) {
      const d1 = new Date(
        inputExpiryYear,
        inputExpiryMonth - 1,
        inputExpiryDate,
        dateObj.getHours() + parseInt(expiryHours),
        dateObj.getMinutes()
      ); // create a new date object with a specified date i.e. expiry date
      expiryDate = d1.getTime(); // convert the above obj in milliseconds
    } else {
      alert('Please add the complete expiry date');
    }
  }
  return (
    <>
      <div className="flex flex-col h-[95%] w-[95%] max-h-[95%] justify-evenly">
        <div className="flex h-[750px] max-h-[750px] w-full">
          <div className="flex flex-col justify-evenly w-[50%] max-h-[90%]">
            <h1 className="text-[24px] text-gum font-questa">Trade NFTS</h1>
            <p className="text-[12px]">
              Using this feature you can create an order to trade NFTs and
              currency with any of your existing contacts. Do this by adding
              NFTs in each of the 2 carts below and then clicking ‘create
              order’.
            </p>
            <div
              onClick={() => {
                setAskTrade(false);
                setOfferTrade(true);
              }}
              className={`flex flex-col bg-parsleytint/[0.5] text-parsley p-2 rounded-[8px] justify-between ${
                offerTrade ? 'border-4 border-parsley/[0.5] border-solid' : ''
              }`}
            >
              <div className="flex justify-between py-2">
                <p className="text-gray1 text-[12px]">My Cart</p>
                <div>
                  <button>
                    <Cart />
                  </button>
                  <button
                    className="mx-3"
                    onClick={() => {
                      setOffers([]);
                    }}
                  >
                    <ClearCart />
                  </button>
                </div>
              </div>
              <div className="flex text-[12px] bg-white0 justify-between p-3">
                <p className="w-[80%]">{truncate(sender, 14)}</p>
                <button>
                  <svg
                    id="cart1"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1.09703 11.7347C1.27318 13.3812 2.59741 14.7055 4.24308 14.8889C5.46542 15.0251 6.72046 15.1422 8.00004 15.1422C9.27961 15.1422 10.5347 15.0251 11.757 14.8889C13.4027 14.7055 14.7269 13.3812 14.903 11.7347C15.0331 10.5193 15.1429 9.27147 15.1429 7.9993C15.1429 6.72712 15.0331 5.47928 14.903 4.26384C14.7269 2.61738 13.4027 1.29314 11.757 1.10971C10.5347 0.973465 9.27961 0.856445 8.00004 0.856445C6.72046 0.856445 5.46542 0.973465 4.24308 1.10971C2.59741 1.29314 1.27318 2.61738 1.09703 4.26384C0.966987 5.47928 0.857178 6.72712 0.857178 7.9993C0.857178 9.27147 0.966988 10.5193 1.09703 11.7347Z"
                      fill="#F2F2F2"
                      stroke="#828282"
                    />
                    <path
                      d="M8.00084 8.51756C8.00084 8.10493 8.33644 7.85183 8.92854 7.4562C9.47773 7.08923 9.76742 6.61321 9.63856 5.96539C9.50971 5.31756 8.97443 4.78229 8.32661 4.65343C7.30969 4.45115 6.33105 5.25429 6.33105 6.29112"
                      stroke="#828282"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M8 11.3765V11.0908"
                      stroke="#828282"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>
            {showHelp === 'cart2' && (
              <p className="text-[12px]">
                Paste in the field below the public address of a person you
                would like to trade with. You can leave this field blank if you
                would like this request be open to the public.
              </p>
            )}
            <div
              onClick={() => {
                setAskTrade(true);
                setOfferTrade(false);
              }}
              className={`flex flex-col bg-parsleytint/[0.5] text-parsley p-2 rounded-[8px] justify-between ${
                askTrade ? 'border-4 border-parsley/[0.5] border-solid' : ''
              }`}
            >
              <div className="flex justify-between py-2">
                <p className="text-gray1 text-[12px]">Their Cart</p>
                <div>
                  <button>
                    <Cart />
                  </button>
                  <button
                    className="mx-3"
                    onClick={() => {
                      setConsiderations([]);
                    }}
                  >
                    <ClearCart />
                  </button>
                </div>
              </div>
              <div className="flex text-[12px] bg-white0 justify-between p-3">
                <input
                  onChange={(e) => setOfferFor(e.target.value)}
                  className="outline-none text-parsley placeholder-parsley w-[80%]"
                ></input>
                {/* <p>{truncate(receiver, 14)}</p> */}
                <button
                  onClick={() => {
                    showHelp !== 'cart2'
                      ? setShowHelp('cart2')
                      : setShowHelp('');
                  }}
                >
                  <svg
                    id="cart2"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1.09703 11.7347C1.27318 13.3812 2.59741 14.7055 4.24308 14.8889C5.46542 15.0251 6.72046 15.1422 8.00004 15.1422C9.27961 15.1422 10.5347 15.0251 11.757 14.8889C13.4027 14.7055 14.7269 13.3812 14.903 11.7347C15.0331 10.5193 15.1429 9.27147 15.1429 7.9993C15.1429 6.72712 15.0331 5.47928 14.903 4.26384C14.7269 2.61738 13.4027 1.29314 11.757 1.10971C10.5347 0.973465 9.27961 0.856445 8.00004 0.856445C6.72046 0.856445 5.46542 0.973465 4.24308 1.10971C2.59741 1.29314 1.27318 2.61738 1.09703 4.26384C0.966987 5.47928 0.857178 6.72712 0.857178 7.9993C0.857178 9.27147 0.966988 10.5193 1.09703 11.7347Z"
                      fill="#F2F2F2"
                      stroke="#828282"
                    />
                    <path
                      d="M8.00084 8.51756C8.00084 8.10493 8.33644 7.85183 8.92854 7.4562C9.47773 7.08923 9.76742 6.61321 9.63856 5.96539C9.50971 5.31756 8.97443 4.78229 8.32661 4.65343C7.30969 4.45115 6.33105 5.25429 6.33105 6.29112"
                      stroke="#828282"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M8 11.3765V11.0908"
                      stroke="#828282"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <h3 className="text-[16px]">Expiry Date</h3>
            <p className="text-[12px]">
              Set a time and set at which this order request will expire. Leave
              field empty to let the order remain active forever.{' '}
            </p>
            <div className="flex justify-between items-center text-[12px] w-full">
              <div className="flex justify-evenly w-[40%] bg-parsleytint rounded-[4px] px-2 py-3">
                <input
                  onChange={(e) => {
                    setInputExpiryYear(e.target.value);
                  }}
                  placeholder="yyyy"
                  className=" w-[40%] pl-1 text-[12px] border-none outline-none placeholder:text-center bg-parsleytint placeholder-parsley text-parsley"
                ></input>
                <span className="text-parsley">-</span>
                <input
                  onChange={(e) => {
                    setInputExpiryMonth(e.target.value);
                  }}
                  placeholder="mm"
                  className=" w-[30%] pl-1 text-[12px] border-none outline-none placeholder:text-center bg-parsleytint placeholder-parsley text-parsley"
                ></input>
                <span className="text-parsley pl-1">-</span>
                <input
                  onChange={(e) => {
                    setInputExpiryDate(e.target.value);
                  }}
                  placeholder="dd"
                  className=" w-[30%] pl-1 text-[12px] border-none outline-none placeholder:text-center bg-parsleytint placeholder-parsley text-parsley"
                ></input>
              </div>
              <input
                onChange={(e) => {
                  setExpiryHours(e.target.value);
                }}
                placeholder="00.00 HRS"
                className="w-[30%] text-[12px] outline-none bg-parsleytint rounded-[4px] p-3 placeholder-parsley text-parsley"
              ></input>
              <button
                className="border-[1px] border-parsley border-solid w-[20%] rounded-[2px] bg-parsleytint text-parsley p-2"
                onClick={() => {
                  addExpiryDate();
                }}
              >
                Add
              </button>
            </div>
            <button
              className="w-full border-[1px] border-gum border-solid rounded-[4px] text-[14px] text-gum h-10 font-bold mt-5 cursor-pointer"
              onClick={() => {
                if (offers.length == 0 || considerations.length == 0) {
                  alert('Order cannot be empty');
                } else {
                  setReviewOrder(true);
                }
              }}
            >
              {'CREATE ORDER'}
            </button>
          </div>
          <div className="w-[50%] ml-8">
            <p className="text-[12px] text-gum mb-2">
              {offerTrade ? 'Your Offer' : 'Your Ask'}
            </p>
            <div className="flex rounded-md items-center justify-between">
              <div className="flex rounded-md items-center bg-parsleytint p-1 w-[50%]">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7.5714 14.2859C11.2796 14.2859 14.2856 11.2798 14.2856 7.57167C14.2856 3.86349 11.2796 0.857422 7.5714 0.857422C3.86322 0.857422 0.857147 3.86349 0.857147 7.57167C0.857147 11.2798 3.86322 14.2859 7.5714 14.2859Z"
                    fill="#DCE5D7"
                    stroke="#4E7B36"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M15.1429 15.1432L12.3238 12.3242"
                    stroke="#4E7B36"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <input
                  placeholder="NFT Collection"
                  value={nftBox}
                  className="w-[80%] text-[12px] rounded-md outline-none bg-parsleytint p-2 placeholder-parsley text-parsley"
                  onChange={(e) => setNftBox(e.target.value)}
                />
              </div>
              <input
                placeholder="Token ID"
                value={tokenId}
                className="w-[30%] text-[12px] rounded-md outline-none bg-parsleytint p-3 placeholder-parsley text-parsley"
                onChange={(e) => setTokenId(e.target.value)}
              />
              <svg
                className="cursor-pointer"
                onClick={
                  offerTrade
                    ? async () => await onAddOffers()
                    : async () => await onAddConsiderations()
                }
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1.097 11.7358C1.27315 13.3823 2.59738 14.7065 4.24304 14.8899C6.7708 15.1717 9.22919 15.1717 11.7569 14.8899C13.4026 14.7065 14.7269 13.3823 14.903 11.7358C15.033 10.5203 15.1429 9.2725 15.1429 8.00031C15.1429 6.72814 15.033 5.4803 14.903 4.26486C14.7269 2.61841 13.4026 1.29417 11.7569 1.11073C9.22919 0.828975 6.7708 0.828975 4.24304 1.11073C2.59738 1.29417 1.27315 2.61841 1.097 4.26486C0.966956 5.4803 0.857147 6.72814 0.857147 8.00031C0.857147 9.2725 0.966957 10.5203 1.097 11.7358Z"
                  fill="#DCE5D7"
                  stroke="#4E7B36"
                />
                <path
                  d="M8 5.14258V10.8569"
                  stroke="#4E7B36"
                  strokeLinecap="round"
                />
                <path
                  d="M10.8571 8H5.14285"
                  stroke="#4E7B36"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div className="flex items-center my-3 justify-between">
              <div className="flex rounded-md text-parsley w-[50%] bg-parsleytint items-center px-2 py-1 justify-between">
                {/* <input placeholder='ETH' className='w-[70%] text-[12px] outline-none bg-parsleytint p-2 placeholder-parsley text-parsley'></input> */}
                <select
                  name="tokens"
                  value={selectOption}
                  onChange={handleChange}
                  id="tokens"
                  className="w-[100%] border-none focus:ring-0 text-[12px] outline-none bg-parsleytint p-2 text-parsley"
                >
                  <option value="ETH" className="bg-white0 text-gray1">
                    ETH
                  </option>
                  <option value="WETH" className="bg-white0 text-gray1">
                    WETH
                  </option>
                </select>
              </div>
              <input
                list="tokens"
                placeholder="Amount"
                ref={inputRef}
                className="rounded-md text-[12px] w-[30%] outline-none bg-parsleytint p-3 placeholder-parsley text-parsley"
                onChange={(e) => {
                  selectOption === 'ETH'
                    ? setEtherBox(e.target.value)
                    : setWEtherBox(e.target.value);
                }}
              />
              <svg
                className="cursor-pointer"
                onClick={
                  offerTrade
                    ? async () => await onAddOffers()
                    : async () => await onAddConsiderations()
                }
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1.097 11.7358C1.27315 13.3823 2.59738 14.7065 4.24304 14.8899C6.7708 15.1717 9.22919 15.1717 11.7569 14.8899C13.4026 14.7065 14.7269 13.3823 14.903 11.7358C15.033 10.5203 15.1429 9.2725 15.1429 8.00031C15.1429 6.72814 15.033 5.4803 14.903 4.26486C14.7269 2.61841 13.4026 1.29417 11.7569 1.11073C9.22919 0.828975 6.7708 0.828975 4.24304 1.11073C2.59738 1.29417 1.27315 2.61841 1.097 4.26486C0.966956 5.4803 0.857147 6.72814 0.857147 8.00031C0.857147 9.2725 0.966957 10.5203 1.097 11.7358Z"
                  fill="#DCE5D7"
                  stroke="#4E7B36"
                />
                <path
                  d="M8 5.14258V10.8569"
                  stroke="#4E7B36"
                  strokeLinecap="round"
                />
                <path
                  d="M10.8571 8H5.14285"
                  stroke="#4E7B36"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div className="h-[90%] max-h-[500px] overflow-y-scroll">
              <CartItems />
              <div className="bg-gray6 rounded-[4px]">
                {nftBox !== '' &&
                  //instead of using includes() which check whether a string 'includes' a sub string at any position, use startsWith()
                  userAssets
                    ?.filter((asset) =>
                      asset.asset_contract.address.startsWith(
                        nftBox.toLowerCase()
                      )
                    )
                    .map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between p-2 items-center"
                      >
                        <div className="w-[20%]">
                          <img
                            className="w-[40px] h-[40px] rounded-[8px] outline-none"
                            src={item.image_url}
                          />
                        </div>
                        <div className="w-[60%] flex flex-col">
                          <p className="text-[12px] text-gum">{item.name}</p>
                          <p className="text-[12px] text-gum">
                            {truncate(item.asset_contract.address, 14)}
                          </p>
                        </div>
                        <div className="w-[10%]">
                          <svg
                            className="cursor-pointer"
                            onClick={async () => {
                              await addNFT(item);
                            }}
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M1.09678 11.7358C1.27293 13.3823 2.59716 14.7065 4.24283 14.8899C6.77059 15.1717 9.22898 15.1717 11.7567 14.8899C13.4024 14.7065 14.7266 13.3823 14.9028 11.7358C15.0328 10.5203 15.1426 9.2725 15.1426 8.00031C15.1426 6.72814 15.0328 5.4803 14.9028 4.26486C14.7266 2.61841 13.4024 1.29417 11.7567 1.11073C9.22898 0.828975 6.77059 0.828975 4.24283 1.11073C2.59716 1.29417 1.27293 2.61841 1.09678 4.26486C0.966743 5.4803 0.856934 6.72814 0.856934 8.00031C0.856934 9.2725 0.966744 10.5203 1.09678 11.7358Z"
                              fill="#EED3DC"
                              stroke="#AB224E"
                            />
                            <path
                              d="M8 5.14258V10.8569"
                              stroke="#AB224E"
                              strokeLinecap="round"
                            />
                            <path
                              d="M10.8574 8H5.14307"
                              stroke="#AB224E"
                              strokeLinecap="round"
                            />
                          </svg>
                        </div>
                      </div>
                    ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      {reviewOrder && (
        <ReviewOrder
          offers={offers}
          considerations={considerations}
          removeOffer={removeOffer}
          removeConsideration={removeConsideration}
          setReviewOrder={setReviewOrder}
          createOrder={createOrder}
          offerFor={offerFor}
          isLoading={isLoading}
          orderCreated={orderCreated}
          setOffers={setOffers}
          setConsiderations={setConsiderations}
          setOrderCreated={setOrderCreated}
          expiryDate={expiryDate}
        />
      )}
    </>
  );
};

export default TradeTab;

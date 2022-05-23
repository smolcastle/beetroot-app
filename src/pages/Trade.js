import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateAcceptTradeData,
  updateCreateTradeData,
} from "../actions/actions";
import Provider from "../utils/Provider";

function TabHeading({ title, index, onPress, isSelected }) {
  return (
    <div
      onClick={() => onPress(index)}
      className={`flex items-center text-base font-medium text-black5 dark:text-white3 px-4 h-10 rounded-md cursor-pointer mx-4 ${
        isSelected
          ? "bg-white3 dark:bg-black3"
          : "hover:bg-white4 dark:hover:bg-black3"
      }`}
    >
      {title}
    </div>
  );
}

function Tabs({ tabIndex, setTab }) {
  return (
    <div className="flex justify-center">
      <TabHeading
        title={"Create a Trade"}
        index={1}
        onPress={setTab}
        isSelected={tabIndex == 1}
      />
      <TabHeading
        title={"Accept a Trade"}
        index={2}
        onPress={setTab}
        isSelected={tabIndex == 2}
      />
    </div>
  );
}

export function Trade({ sender, receiver }) {
  const [wethAmount, setWethAmount] = useState("");
  const [tokenId, setTokenId] = useState("");
  const [tradeTokenId, setTradeTokenId] = useState("");
  const [tabIndex, setTab] = useState(1);
  const { createTradeData, acceptTradeData } = useSelector(
    (state) => state.trades
  );
  const dispatch = useDispatch();

  const getTradesData = async (sender, receiver) => {
    const createdEvents = await Provider.getAllTrades(sender, receiver);
    const receivedEvents = await Provider.getAllTrades(receiver, sender);
    if (createdEvents?.length) {
      dispatch(updateCreateTradeData(createdEvents[createdEvents.length - 1]));
    }
    if (receivedEvents?.length) {
      dispatch(
        updateAcceptTradeData(receivedEvents[receivedEvents.length - 1])
      );
    }
  };

  useEffect(() => {
    if (sender && receiver) {
      Provider.listenTradeEvent(sender, dispatch);
      getTradesData(sender, receiver);
    }
    return () => Provider.removeTradeListener();
  }, [sender, receiver]);

  return (
    <div className="flex flex-1 flex-col">
      <Tabs tabIndex={tabIndex} setTab={setTab} />
      <div className="flex flex-1 items-center flex-col mt-8">
        {tabIndex === 1 && (
          <div className="flex items-center justify-center text-base font-medium text-black5 p-6 w-[80%] border-[1px]">
            <input
              value={tokenId}
              type={"number"}
              name="search"
              autoComplete="off"
              id="search"
              class="w-64 h-8 outline-none text-black5 placeholder:text-black6 bg-white4 pl-4 border-[1px]"
              placeholder={"Enter a token ID to mint"}
              onChange={(e) => setTokenId(e.target.value)}
            />
            <button
              onClick={() => {
                if (isNaN(tokenId)) {
                  alert("Enter valid token id");
                } else {
                  Provider.mintERC721(parseInt(tokenId));
                }
              }}
              type="button"
              class="bg-f2 text-black3 dark:text-black3 h-10 text-base font-medium shadow-sm rounded-md px-4 ml-8"
            >
              {"Mint ERC721 NFT"}
            </button>
          </div>
        )}
        {tabIndex === 1 && (
          <div className="flex flex-col items-center justify-center text-base font-medium text-black5 p-6 w-[80%] border-[1px] mt-4">
            <div
              className={"flex items-center text-xl font-medium text-black5"}
            >
              {"Swap NFT for WETH"}
            </div>
            <input
              value={tradeTokenId}
              type={"number"}
              name="search"
              autoComplete="off"
              id="search"
              class="w-64 h-8 outline-none text-black5 placeholder:text-black6 bg-white4 pl-4 border-[1px] mt-8"
              placeholder={"Enter a token ID to trade"}
              onChange={(e) => setTradeTokenId(e.target.value)}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6 mt-10"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
              />
            </svg>
            <input
              value={wethAmount}
              type={"number"}
              name="search"
              autoComplete="off"
              id="search"
              class="w-64 h-8 outline-none text-black5 placeholder:text-black6 bg-white4 pl-4 border-[1px] mt-8"
              placeholder={"WETH"}
              onChange={(e) => setWethAmount(e.target.value)}
            />
            <button
              onClick={async () => {
                if (isNaN(tradeTokenId)) {
                  alert("Enter valid token id to trade");
                } else if (isNaN(wethAmount)) {
                  alert("Enter valid Weth amount to trade");
                } else {
                  await Provider.createNftTrade(
                    tradeTokenId,
                    wethAmount,
                    receiver
                  );
                  const createdEvents = await Provider.getAllTrades(
                    sender,
                    receiver
                  );
                  if (createdEvents?.length) {
                    dispatch(
                      updateCreateTradeData(
                        createdEvents[createdEvents.length - 1]
                      )
                    );
                  }
                }
              }}
              type="button"
              class="bg-f2 text-black3 dark:text-black3 h-10 text-base font-medium shadow-sm rounded-md px-4 mt-8"
            >
              {"Create Trade"}
            </button>
          </div>
        )}
        {tabIndex === 1 && createTradeData && (
          <div className="flex flex-col items-center justify-center text-base font-medium text-black5 w-[80%] border-[1px] mt-4 p-6">
            <div
              className={`flex items-center text-base font-medium text-black5 dark:text-white3 px-4 h-10 rounded-md mx-4`}
            >
              {"Latest trade created by you"}
            </div>
            <div className="flex flex-wrap pb-6">
              <div
                className={`flex items-center text-sm font-medium text-black5 dark:text-white3 px-4 h-10 rounded-md mx-4`}
              >
                {"Initiator - " + createTradeData.args[6]}
              </div>
              <div
                className={`flex items-center text-sm font-medium text-black5 dark:text-white3 px-4 h-10 rounded-md mx-4`}
              >
                {"Party - " + createTradeData.args[7]}
              </div>
              <div
                className={`flex items-center text-sm font-medium text-black5 dark:text-white3 px-4 h-10 rounded-md mx-4`}
              >
                {"Amount - " +
                  ethers.utils.formatUnits(createTradeData.args[5], 18) +
                  " WETH"}
              </div>
              <div
                className={`flex items-center text-sm font-medium text-black5 dark:text-white3 px-4 h-10 rounded-md mx-4`}
              >
                {"NFT Contract - " + createTradeData.args[0][0]}
              </div>
              <div
                className={`flex items-center text-sm font-medium text-black5 dark:text-white3 px-4 h-10 rounded-md mx-4`}
              >
                {"Token Id - " +
                  createTradeData.args[1]
                    .map((token) => ethers.utils.formatUnits(token, 0))
                    .join(",")}
              </div>
            </div>
            {createTradeData && (
              <div className="flex">
                <button
                  onClick={() => {
                    Provider.cancelNftTrade(
                      createTradeData.args[1],
                      createTradeData.args[5],
                      receiver
                    );
                  }}
                  type="button"
                  class="bg-f2 text-black3 dark:text-black3 h-10 text-base font-medium shadow-sm rounded-md px-4 ml-8"
                >
                  {"Cancel Trade"}
                </button>
              </div>
            )}
          </div>
        )}
        {tabIndex === 2 && acceptTradeData && (
          <div className="flex flex-col items-center justify-center text-base font-medium text-black5 w-[80%] border-[1px] mt-4 p-6">
            <div
              className={`flex items-center text-base font-medium text-black5 dark:text-white3 px-4 h-10 rounded-md mx-4`}
            >
              {"Latest trade received"}
            </div>
            <div className="flex flex-wrap pb-6">
              <div
                className={`flex items-center text-sm font-medium text-black5 dark:text-white3 px-4 h-10 rounded-md mx-4`}
              >
                {"Initiator - " + acceptTradeData.args[6]}
              </div>
              <div
                className={`flex items-center text-sm font-medium text-black5 dark:text-white3 px-4 h-10 rounded-md mx-4`}
              >
                {"Party - " + acceptTradeData.args[7]}
              </div>
              <div
                className={`flex items-center text-sm font-medium text-black5 dark:text-white3 px-4 h-10 rounded-md mx-4`}
              >
                {"Amount - " +
                  ethers.utils.formatUnits(acceptTradeData.args[5], 18) +
                  " WETH"}
              </div>
              <div
                className={`flex items-center text-sm font-medium text-black5 dark:text-white3 px-4 h-10 rounded-md mx-4`}
              >
                {"NFT Contract - " + acceptTradeData.args[0][0]}
              </div>
              <div
                className={`flex items-center text-sm font-medium text-black5 dark:text-white3 px-4 h-10 rounded-md mx-4`}
              >
                {"Token Id - " +
                  acceptTradeData.args[1]
                    .map((token) => ethers.utils.formatUnits(token, 0))
                    .join(",")}
              </div>
            </div>
          </div>
        )}
        {tabIndex === 2 && acceptTradeData && (
          <div className="flex items-center justify-center text-base font-medium text-black5 p-6 w-[80%] border-[1px] mt-4">
            <button
              onClick={() => {
                Provider.acceptNftTrade(
                  acceptTradeData.args[1],
                  acceptTradeData.args[5],
                  receiver
                );
              }}
              type="button"
              class="bg-f2 text-black3 dark:text-black3 h-10 text-base font-medium shadow-sm rounded-md px-4"
            >
              {"Accept Trade"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import Charts from "../components/Charts";
import DropDown from "../components/DropDown";

function CollectionImage({ image }) {
  return (
    <div className="flex w-16">
      <img
        className="w-14 h-14 bg-black3 rounded-full flex-shrink-0"
        src={image}
        alt=""
      />
    </div>
  );
}

function CollectionName({ name }) {
  return (
    <div className="w-48 dark:text-white3 text-black5 text-base font-bold capitalize justify-center items-center ml-4">
      {name}
    </div>
  );
}

function Info() {
  return (
    <div className="flex flex-1">
      <div className="flex flex-1" />
      <div className="flex flex-col justify-center items-center border-[1px] w-44 h-16 border-white1 dark:border-black4 rounded-l-xl">
        <div className="dark:text-white3 text-black5 text-base font-bold capitalize">
          {"14 Items"}
        </div>
        {/* <div class="text-black6 dark:text-white6 font-normal text-sm capitalize">
          {"Your Items"}
        </div> */}
      </div>
      {/* <div className="flex flex-col justify-center items-center border-y-[1px] w-44 h-16 border-white1 dark:border-black4">
        <div className="dark:text-white3 text-black5 text-base font-bold capitalize">
          {"6.4K"}
        </div>
        <div class="text-black6 dark:text-white6 font-normal text-sm capitalize">
          {"owners"}
        </div>
      </div> */}
      {/* <div className="flex flex-col justify-center items-center border-y-[1px] border-l-[1px] w-44 h-16 border-white1 dark:border-black4">
        <div className="dark:text-white3 text-black5 text-base font-bold capitalize">
          {"Ξ 109.5"}
        </div>
        <div class="text-black6 dark:text-white6 font-normal text-sm capitalize">
          {"floor price"}
        </div>
      </div> */}
      <div className="flex flex-col justify-center items-center border-[1px] w-44 h-16 border-white1 dark:border-black4 rounded-r-xl">
        <div className="dark:text-white3 text-black5 text-base font-bold capitalize">
          {"Ξ 491.9K"}
        </div>
        <div class="text-black6 dark:text-white6 font-normal text-sm capitalize">
          {"Holding Value"}
        </div>
      </div>
    </div>
  );
}

function TopInfoSection() {
  const {
    state: {
      collection: { name, image_url },
    },
  } = useLocation();
  return (
    <div className="flex h-24 px-16 items-center dark:bg-black2 bg-white0 mb-2">
      <CollectionImage image={image_url} />
      <CollectionName name={name} />
      <Info />
    </div>
  );
}

function Switch({ tabular, setTabular }) {
  return (
    <div className="flex flex-1 justify-end items-center mr-4">
      <div class="text-black6 dark:text-white6 font-normal text-sm capitalize mr-4">
        {"Tabular"}
      </div>
      <button
        type="button"
        class={`${
          tabular ? "bg-f2 dark:bg-f2" : "bg-white2 dark:bg-black1"
        } relative inline-flex flex-shrink-0 h-6 w-11 rounded-full cursor-pointer transition-colors ease-in-out duration-200`}
        role="switch"
        aria-checked="false"
        onClick={() => setTabular(!tabular)}
      >
        <span class="sr-only">Use setting</span>
        <span
          aria-hidden="true"
          class={`${
            tabular ? "translate-x-5" : "translate-x-0"
          } pointer-events-none inline-block h-[1.5rem] w-[1.5rem] rounded-full bg-white3 shadow transform transition ease-in-out duration-200`}
        ></span>
      </button>
    </div>
  );
}

function TabsSection() {
  const [tabIndex, setTab] = useState(1);
  const [tabular, setTabular] = useState(true);
  return (
    <div className="h-screen w-full dark:bg-black2 bg-white0">
      <div className="flex pt-4">
        <div className="flex flex-1" />
        <div className="flex">
          <TabHeading
            title={"My Items"}
            index={1}
            onPress={setTab}
            isSelected={tabIndex == 1}
          />
          <TabHeading
            title={"Activity"}
            index={2}
            onPress={setTab}
            isSelected={tabIndex == 2}
          />
          <TabHeading
            title={"Analytics"}
            index={3}
            onPress={setTab}
            isSelected={tabIndex == 3}
          />
        </div>
        {tabIndex === 1 ? (
          <Switch tabular={tabular} setTabular={setTabular} />
        ) : (
          <div className="flex flex-1 mr-4" />
        )}
      </div>
      {tabIndex === 1 && (tabular ? <NFTTable /> : <NFTList />)}
    </div>
  );
}

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

function NFTList() {
  const {
    state: {
      collection: { items },
    },
  } = useLocation();
  return (
    <ul
      role="list"
      class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 p-8"
    >
      {Object.values(items).map((item) => {
        const { token_symbol, eth_value } = item;
        return (
          <li class="col-span-1 flex flex-col text-center bg-white rounded-lg shadow divide-y overflow-hidden">
            <div class="flex-1 flex flex-col">
              <img
                class="w-full h-64 flex-shrink-0 object-fill"
                src={
                  "https://lh3.googleusercontent.com/aJeB3DFRf8oxX4XPiTULe7y0ZVb_njSI2iaZTmMkI7RVFJpeLw6QBLEm5VdMIczr3EXpJYChbM-GEPNq4dSLjkw5MEZPaMvhUGR5OA=s0"
                }
                alt=""
              />
              <div className="flex justify-between py-4 px-4">
                <div className="dark:text-white3 text-black5 text-sm font-medium capitalize">
                  {`#${token_symbol}`}
                </div>
                <div className="dark:text-white3 text-black5 text-sm font-medium capitalize">
                  {`Ξ ${eth_value}`}
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function Titles() {
  return (
    <div className="flex dark:bg-black2 bg-white0 h-10 py-2 px-4 mb-1 items-center">
      <DropDown
        title={"NFTs"}
        sortTitle={"Id"}
        containerStyle={"flex flex-1"}
        boxStyle={"ml-20"}
      />
      <DropDown
        title={"Value"}
        sortTitle={"Value"}
        boxStyle={"w-32 text-left"}
      />
      <DropDown
        title={"Buy Price"}
        sortTitle={"Buy"}
        boxStyle={"w-32 text-left"}
      />
      {/* <DropDown
        title={"Gas Fee"}
        sortTitle={"Gas"}
        boxStyle={"w-32 text-left"}
      /> */}
      <div className="dark:text-white3 text-black5 text-sm font-medium capitalize w-32 mr-2">
        {"24H Volume"}
      </div>
    </div>
  );
}

function NFTImage({ image }) {
  return (
    <div className="flex w-12 ml-12">
      <img
        className="w-12 h-12 bg-black3 rounded-lg flex-shrink-0"
        src={image}
        alt=""
      />
    </div>
  );
}

function NFTTokenId({ id }) {
  return (
    <div className="flex flex-1 w-full">
      <h3 className="dark:text-white3 text-black5 text-sm font-medium line-clamp-2 w-5/6 capitalize w-28 ml-8">
        {id}
      </h3>
    </div>
  );
}

function BuyPrice({ price }) {
  return (
    <div className="dark:text-white3 text-black5 text-sm font-medium capitalize justify-center items-center w-32">
      {`Ξ ${price}`}
    </div>
  );
}

function FloorPrice({ price }) {
  return (
    <div className="dark:text-white3 text-black5 text-sm font-medium capitalize justify-center items-center w-32">
      {`Ξ ${price}`}
    </div>
  );
}

function GasFee({ gasfee }) {
  return (
    <div className="dark:text-white3 text-black5 text-sm font-medium capitalize justify-center items-center w-32">
      {gasfee}
    </div>
  );
}

function NFTTable() {
  const {
    state: {
      collection: { items },
    },
  } = useLocation();
  return (
    <ul role="list">
      <Titles />
      {Object.values(items).map((item, index) => {
        const { token_symbol, eth_value } = item;
        return (
          <li
            key={index}
            className="dark:bg-black2 bg-white0 h-16 flex flex-col overflow-hidden hover:bg-white4 dark:hover:bg-black3 cursor-pointer"
          >
            <div className="flex flex-1 items-center justify-around relative">
              <NFTImage
                image={
                  "https://lh3.googleusercontent.com/aJeB3DFRf8oxX4XPiTULe7y0ZVb_njSI2iaZTmMkI7RVFJpeLw6QBLEm5VdMIczr3EXpJYChbM-GEPNq4dSLjkw5MEZPaMvhUGR5OA=s0"
                }
              />
              <NFTTokenId id={`#${token_symbol}`} />
              <FloorPrice price={"164.24"} />
              <BuyPrice price={eth_value} />
              {/* <GasFee gasfee={"0.000254"} /> */}
              <Charts />
            </div>
            <div class="h-[0.0625rem] w-full bg-white5 dark:bg-black8" />
          </li>
        );
      })}
    </ul>
  );
}

export default function CollectionDetail() {
  return (
    <div class="flex flex-col w-full h-full pl-0 md:p-2 md:space-y-4 overflow-scroll">
      <ul role="list" className="px-96">
        <TopInfoSection />
        <TabsSection />
      </ul>
    </div>
  );
}

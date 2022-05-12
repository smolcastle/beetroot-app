import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import Charts from "../components/Charts";
import DropDown from "../components/DropDown";
import PortfolioValue from "../components/PortfolioValue";
import Price from "../components/Price";
import Robot from "../components/robot/Robot";
import useDarkMode from "../hooks/useDarkMode";
import ValueBy from "../components/ValueBy";
import looks from "../img/looks.png";
import dw from "../img/d_w.png";
import db from "../img/d_b.png";
import tw from "../img/t_w.png";
import tb from "../img/t_b.png";
import Search from "../components/Search";

function LinksImage() {
  const [colorTheme] = useDarkMode();
  return (
    <div className="flex flex-row items-center">
      <img
        className="w-7 h-7 rounded-full flex-shrink-0 mr-6"
        src={"https://opensea.io/static/images/logos/opensea.svg"}
        alt=""
      />
      <img className="w-10 h-8 rounded-full flex-shrink-0" src={looks} alt="" />
      <div className="w-[2px] h-10 bg-white5 dark:bg-black8 mx-6" />
      <img
        className="w-6 h-7 rounded-full flex-shrink-0 mr-6"
        src={colorTheme === "dark" ? db : dw}
        alt=""
      />
      <img
        className="w-7 h-5 rounded-full flex-shrink-0 mr-6 object-contain"
        src={colorTheme === "dark" ? tb : tw}
        alt=""
      />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6 dark:text-white3 text-black5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
        />
      </svg>
    </div>
  );
}

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
    <div className="dark:text-white3 text-black5 text-2xl font-medium capitalize justify-center items-center mx-4">
      {name}
    </div>
  );
}

function Info() {
  return (
    <div className="flex flex-1">
      <div className="flex flex-1" />
      <div className="flex flex-col justify-center items-center border-[1px] w-44 h-16 border-white1 dark:border-black4 rounded-l-xl"></div>
      <div className="flex flex-col justify-center items-center border-[1px] w-44 h-16 border-white1 dark:border-black4 rounded-r-xl">
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
      collection: { name, image_url, items },
    },
  } = useLocation();
  return (
    <div className="flex justify-between shrink-0 h-28 px-16 items-center dark:bg-black2 bg-white0 mb-2">
      <div className="flex">
        <CollectionImage image={image_url} />
        <div className="flex flex-col">
          <div className="flex justify-center items-center">
            <CollectionName name={name} />
            <div class="py-1 px-2 bg-f2 text-black3 text-sm font-medium shadow-sm rounded-md">
              {`${Object.values(items)?.length} Items`}
            </div>
          </div>
          <div className="dark:text-white3 text-black5 text-2xl font-bold capitalize pl-4 pt-1">
            <Price price={"491.9"} />
          </div>
        </div>
      </div>
      <div>
        <LinksImage />
      </div>
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
  const [searchString, setSearchString] = useState("");
  return (
    <div className="flex flex-col dark:bg-black2 bg-white0 overflow-scroll">
      <div className={`flex pt-2 ${!tabular ? "pb-2" : ""}`}>
        <div className="flex flex-1 items-center">
          <div className="pl-8">
            <Search
              searchString={searchString}
              setSearchString={setSearchString}
            />
          </div>
        </div>
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
      {tabIndex === 1 && (
        <div className="flex flex-col overflow-scroll">
          {tabular && <Titles />}
          <div className="overflow-scroll">
            {tabular ? (
              <NFTTable searchString={searchString} />
            ) : (
              <NFTList searchString={searchString} />
            )}
          </div>
        </div>
      )}
      {(tabIndex === 2 || tabIndex === 3) && (
        <div className="bg-white4 dark:bg-black7">
          <div className="mt-60 text-center text-6xl py-2 text-black5 dark:text-white3 font-bold overflow-hidden">
            {"Coming soon!"}
          </div>
          <Robot />
        </div>
      )}
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

function NFTList({ searchString }) {
  const {
    state: {
      collection: { items },
    },
  } = useLocation();
  const filteredResult = Object.values(items)?.filter((item) => {
    return (
      item.token_symbol.toLowerCase().includes(searchString.toLowerCase()) ||
      item.token_standard.toLowerCase().includes(searchString.toLowerCase())
    );
  });
  return (
    <ul
      role="list"
      class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 p-8"
    >
      {filteredResult?.map((item) => {
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
                  <Price price={eth_value} />
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
      <div className="dark:text-white3 text-black5 text-sm font-medium capitalize w-16 ml-4">
        {"Rank"}
      </div>
      <DropDown
        title={"NFTs"}
        sortTitle={"Id"}
        containerStyle={"flex flex-1"}
        boxStyle={"ml-4"}
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

function NFTRank({ rank }) {
  return (
    <div className="dark:text-white3 text-black5 text-sm font-medium capitalize justify-center items-center w-8 ml-8 text-center">
      {rank}
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
      <Price price={price} />
    </div>
  );
}

function FloorPrice({ price }) {
  return (
    <div className="dark:text-white3 text-black5 text-sm font-medium capitalize justify-center items-center w-32">
      <Price price={price} />
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

function NFTTable({ searchString }) {
  const {
    state: {
      collection: { items },
    },
  } = useLocation();
  const filteredResult = Object.values(items)?.filter((item) => {
    return (
      item.token_symbol.toLowerCase().includes(searchString.toLowerCase()) ||
      item.token_standard.toLowerCase().includes(searchString.toLowerCase())
    );
  });
  return (
    <ul role="list" className="flex flex-1 flex-col">
      {filteredResult?.map((item, index) => {
        const { token_symbol, eth_value } = item;
        return (
          <div key={index}>
            <li
              onClick={() => console.log(item)}
              className="dark:bg-black2 bg-white0 h-16 flex flex-col overflow-hidden hover:bg-white4 dark:hover:bg-black3 cursor-pointer"
            >
              <div className="flex flex-1 items-center justify-around relative">
                <NFTRank rank={index + 1} />
                <NFTImage
                  image={
                    "https://lh3.googleusercontent.com/aJeB3DFRf8oxX4XPiTULe7y0ZVb_njSI2iaZTmMkI7RVFJpeLw6QBLEm5VdMIczr3EXpJYChbM-GEPNq4dSLjkw5MEZPaMvhUGR5OA=s0"
                  }
                />
                <NFTTokenId id={`#${token_symbol}`} />
                <FloorPrice price={"164.24"} />
                <BuyPrice price={parseFloat(eth_value).toFixed(2)} />
                {/* <GasFee gasfee={"0.000254"} /> */}
                <Charts />
              </div>
              <div class="h-[0.0625rem] w-full bg-white5 dark:bg-black8" />
            </li>
          </div>
        );
      })}
    </ul>
  );
}

export default function CollectionDetail() {
  return (
    <div class="flex flex-row w-full h-full pl-0 md:p-2 md:space-y-4">
      <div>
        <PortfolioValue />
        <ValueBy />
      </div>
      <div className="flex flex-1 flex-col pr-96">
        <TopInfoSection />
        <TabsSection />
        {/* <NFTTable /> */}
      </div>
    </div>
  );
}

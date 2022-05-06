import { useCallback, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Charts from "./Charts";
import DropDown from "./DropDown";
import UserInfo from "./PortfolioValue";
import Price from "./Price";
import Search from "./Search";

function CollectionImage({ img_url }) {
  return (
    <div className="flex w-12 items-end ml-8">
      <img
        className="w-10 h-10 bg-black3 rounded-full flex-shrink-0"
        src={img_url}
        alt=""
      />
    </div>
  );
}

function CollectionName({ name, items }) {
  return (
    <div className="flex flex-1 flex-col w-full mx-4">
      <div className="dark:text-white3 text-black5 text-sm font-medium capitalize justify-center items-center">
        {name}
      </div>
      <div class="text-black6 dark:text-white6 font-normal text-sm justify-center items-center">
        {`${items} items`}
      </div>
    </div>
  );
}

function CollectionFloorPrice({ floorPrice, index }) {
  return (
    <div className="flex flex-col w-32">
      <div className="dark:text-white3 text-black5 text-sm font-medium capitalize justify-center items-center">
        <Price price={floorPrice} />
      </div>
      <div
        class={`${
          index % 2 === 0 ? "text-green" : "text-red"
        } font-bold text-xs justify-center items-center`}
      >
        {`${0.25} %`}
      </div>
    </div>
  );
}

function CollectionMarketCap({ marketCap, index }) {
  return (
    <div className="flex flex-col w-32">
      <div className="dark:text-white3 text-black5 text-sm font-medium capitalize justify-center items-center">
        <Price price={marketCap} />
      </div>
      <div
        class={`${
          index % 2 === 0 ? "text-green" : "text-red"
        } font-bold text-xs justify-center items-center`}
      >
        {`${0.25} %`}
      </div>
    </div>
  );
}

function CollectionHolding({ holding, index }) {
  return (
    <div className="flex flex-col w-32">
      <div className="dark:text-white3 text-black5 text-sm font-medium capitalize justify-center items-center">
        <Price price={holding} />
      </div>
      <div
        class={`${
          index % 2 === 0 ? "text-green" : "text-red"
        } font-bold text-xs justify-center items-center`}
      >
        {`${0.25} %`}
      </div>
    </div>
  );
}

function Titles({ searchString, setSearchString }) {
  return (
    <div className="flex dark:bg-black2 bg-white0 h-12 py-2 px-4 mb-1 items-center">
      <div className="dark:text-white3 text-black5 text-sm font-medium capitalize pl-4">
        {"My Portfolio"}
      </div>
      <div className="flex flex-1 ml-8">
        <Search searchString={searchString} setSearchString={setSearchString} />
      </div>
      <DropDown
        title={"Floor Price"}
        sortTitle={"Price"}
        boxStyle={"w-32 text-left"}
      />
      <div className="dark:text-white3 text-black5 text-sm font-medium capitalize w-32">
        {"Market Cap"}
      </div>
      <DropDown
        title={"Holding Value"}
        sortTitle={"Value"}
        boxStyle={"w-32 text-left"}
      />
      <div className="dark:text-white3 text-black5 text-sm font-medium capitalize w-32 mr-2">
        {"Floor Price (24H)"}
      </div>
    </div>
  );
}

export default function Lists({ collections }) {
  const [searchString, setSearchString] = useState("");
  const filteredResult = collections.filter((item) => {
    return Object.values(item)
      .join("")
      .toLowerCase()
      .includes(searchString.toLowerCase());
  });
  return (
    <div className="flex flex-1 flex-col pr-96">
      <Titles searchString={searchString} setSearchString={setSearchString} />
      <ul role="list" className="flex flex-1 flex-col overflow-scroll">
        {filteredResult.map((collection, index) => {
          const { name, image_url, address, items } = collection;
          return (
            <Link key={index} to={"/collection"} state={{ collection }}>
              <li className="dark:bg-black2 bg-white0 h-16 flex flex-col overflow-hidden hover:bg-white4 dark:hover:bg-black3 cursor-pointer">
                <div className="flex flex-1 items-center justify-around relative">
                  <CollectionImage img_url={image_url} />
                  <CollectionName
                    name={name || address}
                    items={Object.values(items).length}
                  />
                  <CollectionFloorPrice floorPrice={"2.25"} index={index} />
                  <CollectionMarketCap marketCap={"2.25"} index={index} />
                  <CollectionHolding holding={"2.25"} index={index} />
                  <Charts />
                </div>
                <div class="h-[0.0625rem] w-full bg-white5 dark:bg-black8" />
              </li>
            </Link>
          );
        })}
      </ul>
    </div>
  );
}

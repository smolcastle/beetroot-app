import { useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import col from "../pages/test.json";
import UserInfo from "./UserInfo";

function CollectionImage({ img_url }) {
  return (
    <div className="flex w-12 items-end">
      <img
        className="w-10 h-10 bg-black3 rounded-full flex-shrink-0"
        src={img_url}
        alt=""
      />
    </div>
  );
}

function CollectionRank({ rank }) {
  return (
    <div className="flex w-12 items-end">
      <h3 className="dark:text-white3 text-black5 text-sm font-medium line-clamp-2 w-5/6 text-center capitalize">
        {rank}
      </h3>
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

function CollectionFloorPrice({ floorPrice }) {
  return (
    <div className="flex flex-col w-28">
      <div className="dark:text-white3 text-black5 text-sm font-medium capitalize justify-center items-center">
        {`Ξ ${floorPrice}`}
      </div>
      <div class="text-black6 dark:text-white6 font-light text-xs justify-center items-center">
        {`${0.25} %`}
      </div>
    </div>
  );
}

function CollectionMarketCap({ marketCap }) {
  return (
    <div className="flex flex-col w-28">
      <div className="dark:text-white3 text-black5 text-sm font-medium capitalize justify-center items-center">
        {`Ξ ${marketCap}`}
      </div>
      <div class="text-black6 dark:text-white6 font-light text-xs justify-center items-center">
        {`${0.25} %`}
      </div>
    </div>
  );
}

function CollectionHolding({ holding }) {
  return (
    <div className="flex flex-col w-24 mr-4">
      <div className="dark:text-white3 text-black5 text-sm font-medium capitalize justify-center items-center">
        {`Ξ ${holding}`}
      </div>
      <div class="text-black6 dark:text-white6 font-light text-xs justify-center items-center">
        {`${0.25} %`}
      </div>
    </div>
  );
}

function Titles() {
  return (
    <div className="flex dark:bg-black2 bg-white0 h-10 py-2 px-4 mb-1 items-center">
      <div className="flex flex-1 dark:text-white3 text-black5 text-sm font-medium capitalize">
        {"Collections"}
      </div>
      <div className="dark:text-white3 text-black5 text-sm font-medium capitalize w-28">
        {"Floor Price"}
      </div>
      <div className="dark:text-white3 text-black5 text-sm font-medium capitalize w-28">
        {"Market Cap"}
      </div>
      <div className="dark:text-white3 text-black5 text-sm font-medium capitalize w-24">
        {"Holdings"}
      </div>
    </div>
  );
}

export default function Lists() {
  const collections = [...col];

  return (
    <ul role="list" className="px-96">
      <Titles />
      {collections.map((collection, index) => {
        const { name, owned_asset_count, featured_image_url } = collection;
        return (
          <Link to={"/collection"} state={{ name, image: featured_image_url }}>
            <li
              key={index}
              className="dark:bg-black2 bg-white0 h-16 flex flex-col overflow-hidden hover:bg-white4 dark:hover:bg-black3 cursor-pointer"
            >
              <div className="flex flex-1 items-center justify-around relative">
                <CollectionRank rank={index} />
                <CollectionImage img_url={featured_image_url} />
                <CollectionName name={name} items={index} />
                <CollectionFloorPrice floorPrice={"2.25"} />
                <CollectionMarketCap marketCap={"2.25"} />
                <CollectionHolding holding={"2.25"} />
              </div>
              <div class="h-[0.0625rem] w-full bg-white5 dark:bg-black8" />
            </li>
          </Link>
        );
      })}
    </ul>
  );
}

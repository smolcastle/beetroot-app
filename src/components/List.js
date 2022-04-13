import { useCallback, useRef } from "react";
import col from "../pages/test.json";

export default function Lists() {
  const collections = [...col];
  // const collections = [...col, ...col, ...col, ...col, ...col, ...col, ...col, ...col, ...col, ...col, ...col, ...col, ...col, ...col, ...col, ...col, ...col, ...col, ...col, ...col, ...col, ...col, ...col, ...col, ...col, ...col, ...col, ...col, ...col, ...col, ...col, ...col, ...col, ...col, ...col, ...col, ...col, ...col, ...col, ...col, ...col, ...col, ...col, ...col, ...col, ...col, ...col, ...col, ...col, ...col, ...col, ...col, ...col, ...col, ...col, ...col, ...col, ...col, ...col, ...col, ...col, ...col, ...col, ...col, ...col, ...col, ...col, ...col, ...col, ...col]
  // console.log('length', collections.length)

  return (
    <ul
      role="list"
      className="grid grid-cols-3 gap-x-4 gap-y-6 sm:grid-cols-4 sm:gap-x-6 lg:grid-cols-9 xl:gap-x-6"
    >
      {collections.map((collection, index) => {
        const { name, owned_asset_count, featured_image_url } = collection;
        return (
          <li
            key={index}
            className="dark:bg-black2 bg-white0 rounded-md shadow divide-y divide-gray-200 h-56 flex overflow-hidden"
          >
            <div className="flex flex-1 flex-col items-center justify-around relative">
              <div className="flex flex-1 items-end mb-3">
                <img
                  className="w-16 h-16 bg-black3 rounded-full flex-shrink-0"
                  src={featured_image_url}
                  alt=""
                />
              </div>
              <div className="flex flex-1 flex-col w-full">
                <div class="flex flex-1 justify-center items-center">
                  <h3 className="dark:text-white3 text-black5 text-sm font-medium line-clamp-2 w-5/6 text-center capitalize">
                    {name}
                  </h3>
                </div>
                <div class="h-[0.0625rem] w-full bg-white5 dark:bg-black8" />
                <div class="flex justify-center items-center h-8 text-black6 dark:text-white6 font-normal text-sm">
                  {"$1,323,212.12"}
                </div>
              </div>
              <div class="absolute dark:bg-black5 bg-black1 h-6 px-3 top-0 left-0 dark:text-f2 text-f2 text-xs flex justify-center items-center font-medium">
                {`${owned_asset_count} ${
                  owned_asset_count === 1 ? "item" : "items"
                }`}
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

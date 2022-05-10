import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUSDBool } from "../actions/actions";
import Price from "./Price";

function Switch({ enable, setEnable }) {
  return (
    <div className="flex flex-1 justify-center items-center mr-4 mt-2">
      <button
        type="button"
        class={`${
          enable ? "bg-f2 dark:bg-f2" : "bg-white2 dark:bg-black1"
        } relative inline-flex flex-shrink-0 h-4 w-8 rounded-full cursor-pointer transition-colors ease-in-out duration-200`}
        role="switch"
        aria-checked="false"
        onClick={setEnable}
      >
        <span class="sr-only">Use setting</span>
        <span
          aria-hidden="true"
          class={`${
            enable ? "translate-x-5" : "translate-x-0"
          } pointer-events-none inline-block h-[1rem] w-[1rem] rounded-full bg-white3 shadow transform transition ease-in-out duration-200`}
        ></span>
      </button>
      <div class="text-black6 dark:text-white6 font-normal text-sm capitalize ml-4">
        {"USD"}
      </div>
    </div>
  );
}

export default function PortfolioValue() {
  const enableUSD = useSelector((state) => state.enableUSD.enableUSD);
  const dispatch = useDispatch();
  return (
    <div className="w-[23.5rem] h-40 mt-4 mr-2 dark:bg-black2 bg-white0">
      <div className="dark:text-white3 text-black5 text-xl font-normal capitalize flex justify-center items-center pt-6">
        {`Portfolio Value`}
      </div>
      <div className="dark:text-white3 text-black5 text-3xl font-bold capitalize flex justify-center items-center pt-2">
        <Price price={"223543.23"} />
      </div>
      <div class="text-green font-bold text-base flex justify-center items-center">
        {`+ ${0.25} % (`}
        <div className="text-sm mt-0.5">
          <Price price={"558.85"} />
        </div>
        {")"}
      </div>
      <Switch
        enable={enableUSD}
        setEnable={() => dispatch(updateUSDBool(!enableUSD))}
      />
    </div>
  );
}

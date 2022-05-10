import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUSDBool } from "../actions/actions";
import Price from "./Price";

function Button({ selectedIndex, setIndex, index, title }) {
  const isSelected = selectedIndex === index;
  return (
    <button
      onClick={() => setIndex(index)}
      type="button"
      className={`py-1 h-9 text-[12px] shadow-sm rounded-md w-36 ${
        isSelected
          ? "bg-f2 text-black3 font-medium text-[13px]"
          : "border-[1px] dark:border-white3 border-black5 dark:text-white3 text-black5 font-light"
      }`}
    >
      {title}
    </button>
  );
}

export default function ValueBy() {
  const [selectedIndex, setIndex] = useState(1);
  return (
    <div className="w-[23.5rem] h-40 mt-4 mr-2 dark:bg-black2 bg-white0">
      <div className="dark:text-white3 text-black5 text-base font-normal capitalize flex justify-center items-center pt-2">
        {`Show Value By`}
      </div>
      <div className="flex justify-center mb-4 mt-4">
        <Button
          selectedIndex={selectedIndex}
          setIndex={setIndex}
          index={1}
          title={"Floor Price"}
        />
        <div className="w-4" />
        <Button
          selectedIndex={selectedIndex}
          setIndex={setIndex}
          index={2}
          title={"Last Traded Price"}
        />
      </div>
      <div className="flex justify-center">
        <Button
          selectedIndex={selectedIndex}
          setIndex={setIndex}
          index={3}
          title={"Sell Order Price"}
        />
        <div className="w-4" />
        <Button
          selectedIndex={selectedIndex}
          setIndex={setIndex}
          index={4}
          title={"Price Estimator"}
        />
      </div>
    </div>
  );
}

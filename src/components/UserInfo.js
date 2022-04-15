import React from "react";

export default function UserInfo() {
  return (
    <div className="flex">
      <div className="flex flex-col mr-4 justify-center">
        <div className="dark:text-white3 text-black5 text-base font-normal capitalize justify-center items-center">
          {`Total Value`}
        </div>
        <div class="text-black6 dark:text-white6 font-light text-xs justify-center items-center">
          {"  "}
        </div>
      </div>
      <div className="flex flex-col mr-4">
        <div className="dark:text-white3 text-black5 text-base font-bold capitalize justify-center items-center">
          {`Ξ 223543.23`}
        </div>
        <div class="text-black6 dark:text-white6 font-light text-xs justify-center items-center">
          {`${0.25} %`}
        </div>
      </div>
    </div>
  );
}

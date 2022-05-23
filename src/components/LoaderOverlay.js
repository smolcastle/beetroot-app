import React from "react";
import { WindMillLoading } from "react-loadingg";
import { useSelector } from "react-redux";

export default function LoaderOverlay() {
  const loading = useSelector((state) => state.loader.showLoader);
  if (!loading) {
    return <></>;
  }
  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative w-auto my-4 mx-auto max-w-3xl">
          {/*content*/}
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            <div className="h-56 w-56 bg-nord-dark1">
              <WindMillLoading size={"large"} color={"#E8B81C"} />
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  );
}

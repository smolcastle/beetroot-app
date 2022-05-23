import React from "react";
import { useSelector } from "react-redux";

export default function SigningModal({
  signMessage,
  sender,
  setSignModalState,
  dispatch,
}) {
  const { chainId } = useSelector((state) => state.wallet);
  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative w-auto my-4 mx-auto max-w-3xl">
          {/*content*/}
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            {/*header*/}
            <div className="flex items-start justify-between p-5 border-b border-solid rounded-t">
              <h3 className="text-3xl font-semibold text-black4">
                You need to authenticate by signing
              </h3>
              <button
                className="text-black4 font-bold uppercase px-4 py-2 text-sm mr-1 mb-1 ml-20 mt-[1px]"
                type="button"
                onClick={() => setSignModalState(false)}
              >
                Close
              </button>
            </div>
            {/*body*/}
            <div className="relative p-6 flex-auto">
              <button
                onClick={() => {
                  signMessage(sender, dispatch, chainId);
                  setSignModalState(false);
                }}
                type="button"
                class={
                  "flex bg-f2 text-black3 h-10 w-full text-base shadow-sm rounded-md justify-center items-center"
                }
              >
                {"Authenticate"}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  );
}

import React from "react";
import { useSelector } from "react-redux";
import { useSigner } from "wagmi";

export default function SigningModal({
  signMessage,
  sender,
  setSignModalState,
  dispatch,
  chainId
}) {

  const {data: signer} = useSigner();

  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 outline-none focus:outline-none">
        <div className="relative w-auto my-4 mx-auto max-w-3xl">
          {/*content*/}
          <div className="rounded-lg shadow-lg relative h-[250px] flex flex-col w-full bg-white0 outline-none focus:outline-none">
            {/*header*/}
            <div className="flex items-start justify-between p-5 rounded-t">
              <h3 className="text-[32px] font-semibold text-gum">
                You need to authenticate by signing
              </h3>
            </div>
            {/*body*/}
            <div className="relative p-6 flex-auto">
              <button
                onClick={() => {
                  signMessage(sender, dispatch, chainId, signer);
                  setSignModalState(false);
                }}
                type="button"
                class={
                  "flex border-2 border-gum border-solid text-black0 h-10 w-full text-gray1 shadow-sm rounded-md justify-center items-center mt-16"
                }
              >
                {"Authenticate"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

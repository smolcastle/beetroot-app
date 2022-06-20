import React, { useState } from "react";

export default function NewChatModal({
  saveMessage,
  sender,
  dispatch,
  setModalState,
  getAllQueues,
  setSelected,
  index
}) {
  const [receiver, setReceiver] = useState("");
  const [message, setMessage] = useState("");
  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative w-auto my-4 mx-auto max-w-3xl">
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-black outline-none focus:outline-none">
            <div className="flex items-start justify-between p-5 border-b border-solid rounded-t">
              <h3 className="text-3xl font-semibold text-white0">
                Start a new chat
              </h3>
              <button
                className="text-themepink font-bold uppercase px-4 py-2 text-sm mr-1 mb-1 ml-20 mt-[1px]"
                type="button"
                onClick={() => setModalState(false)}
              >
                Close
              </button>
            </div>
            <div className="relative p-6 flex-auto">
              <div className="flex w-full h-12 border-[1px] justify-center items-center mb-4">
                <input
                  value={receiver}
                  type="text"
                  name="search"
                  autoComplete="off"
                  id="search"
                  class="w-full h-full outline-none text-white0 placeholder:text-white0 bg-white10 pl-4"
                  placeholder={"Enter recipient's address"}
                  onChange={(e) => setReceiver(e.target.value)}
                />
              </div>
              <div className="flex w-full h-12 border-[1px] justify-center items-center mb-4">
                <input
                  value={message}
                  type="text"
                  name="search"
                  autoComplete="off"
                  id="search"
                  class="w-full h-full outline-none text-white0 placeholder:text-white0 bg-white10 pl-4"
                  placeholder={"Write your first message"}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>
              <button
                onClick={() => {
                  if (receiver.length) {
                    saveMessage(message, sender, receiver, dispatch);
                    setModalState(false);
                    getAllQueues(sender, dispatch);
                    setSelected(index+1)
                  }
                }}
                type="button"
                disabled={!receiver.length }
                class={`flex bg-themepink text-black h-10 w-full font-bold text-base shadow-sm rounded-sm justify-center items-center ${
                  !receiver.length 
                    ? "cursor-not-allowed"
                    : ""
                }`}
              >
                {"Start New Chat"}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  );
}

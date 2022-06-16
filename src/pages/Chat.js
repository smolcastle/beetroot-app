import React, { useEffect, useState } from "react";

import {
  getFirestore,
  collection,
  where,
  addDoc,
  query,
  orderBy,
  limit,
  onSnapshot,
  getDocs,
  getDoc,
  setDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux";
import {
  hideLoader,
  resetMessages,
  showLoader,
  updateMessage,
  updateMessages,
  updateQueueIds,
  updateSignatureData,
} from "../actions/actions";
import Search from "../components/Search";
import { getDateTime, isFunction, truncate } from "../helpers/Collections";
import NewChatModal from "../components/NewChatModal";
import Provider from "../utils/Provider";
import SigningModal from "../components/SigningModal";
import { ethers } from "ethers";
import { Trade } from "./Trade";
import { generateNonce, SiweMessage } from "siwe";
import Order from "./Order";

const arr = ["a", "b", "c", "d"];

// Saves a new message to Cloud Firestore.
async function saveMessage(messageText, sender, receiver, dispatch) {
  if (!messageText?.trim().length) {
    return;
  }
  // Add a new message entry to the Firebase database.
  try {
    await addDoc(collection(getFirestore(), "messages"), {
      name: sender,
      text: messageText,
      uid: sender,
      receiver,
      queue_id:
        sender > receiver ? `${receiver}_${sender}` : `${sender}_${receiver}`,
      profilePicUrl: "https://i.pravatar.cc/150?img=3",
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error writing new message to Firebase Database", error);
  }
}

// Loads chat messages history and listens for upcoming ones.
async function getAllQueues(sender, dispatch) {
  const queue_ids = {};
  // Create the query to load the last 12 messages and listen for new ones.
  const query1 = query(
    collection(getFirestore(), "messages"),
    where("receiver", "==", sender),
    orderBy("timestamp", "asc")
  );

  const query2 = query(
    collection(getFirestore(), "messages"),
    where("name", "==", sender),
    orderBy("timestamp", "asc")
  );

  const querySnapshot1 = await getDocs(query1);
  const querySnapshot2 = await getDocs(query2);

  querySnapshot1.forEach((doc) => {
    queue_ids[doc.data().queue_id] = true;
  });
  querySnapshot2.forEach((doc) => {
    queue_ids[doc.data().queue_id] = true;
  });
  dispatch(updateQueueIds(Object.keys(queue_ids).length ? queue_ids : null));
  dispatch(hideLoader());
}

// Loads chat messages history and listens for upcoming ones.
function listenMessages(sender, receiver, dispatch) {
  // Create the query to load the last 12 messages and listen for new ones.
  const recentMessagesQuery = query(
    collection(getFirestore(), "messages"),
    where(
      "queue_id",
      "==",
      sender > receiver ? `${receiver}_${sender}` : `${sender}_${receiver}`
    ),
    orderBy("timestamp", "desc"),
    limit(50)
  );

  const unsubscribe = onSnapshot(recentMessagesQuery, (querySnapshot) => {
    const messages = [];
    querySnapshot.forEach((doc) => {
      messages.push(doc.data());
      //   dispatch(updateMessage(doc.data()));
    });
    dispatch(updateMessages(messages.length ? messages : null));
  });
  return unsubscribe;
}

async function getSignatureData(sender, dispatch) {
  const signRef = doc(getFirestore(), "signings", sender);
  const signatureDataSnap = await getDoc(signRef);

  if (signatureDataSnap.exists()) {
    const signatureData = signatureDataSnap.data();
    const recoveredAddress = ethers.utils.verifyMessage(
      signatureData.message,
      signatureData.signature
    );
    if (recoveredAddress === sender) {
      dispatch(updateSignatureData(signatureData));
      getAllQueues(sender, dispatch);
    } else {
      dispatch(hideLoader());
      alert("Signature did not match");
    }
  } else {
    dispatch(hideLoader());
    console.log("No such document!");
  }
}

async function signMessage(sender, dispatch, chainId) {
  try {
    dispatch(showLoader());
    const nonce = generateNonce();
    const message = new SiweMessage({
      domain: window.location.host,
      address: sender,
      statement: "Sign in with Ethereum to the app.",
      uri: window.location.origin,
      version: "1",
      chainId,
      nonce,
    });
    const msgStr = message.prepareMessage();
    const signature = await Provider.signMessage(msgStr);
    const recoveredAddress = ethers.utils.verifyMessage(msgStr, signature);
    if (recoveredAddress === sender) {
      const signingsRef = collection(getFirestore(), "signings");
      await setDoc(doc(signingsRef, sender), {
        address: sender,
        signature,
        message: msgStr,
        timestamp: serverTimestamp(),
      });
      getSignatureData(sender, dispatch);
    } else {
      dispatch(hideLoader());
      alert("Signature did not match");
    }
  } catch (error) {
    dispatch(hideLoader());
    console.error("Error writing new message to Firebase Database", error);
  }
}

function TopSection({ sender, receiver, setReceiver, dispatch }) {
  return (
    <div class="flex-1 flex flex-col">
      <div className="text-black1 text-sm font-medium capitalize my-8">{`Your Address - ${sender}`}</div>
      <div className="text-black1 text-xl font-medium capitalize my-8">
        {"Enter address you want to chat with"}
        <Search
          searchString={receiver}
          setSearchString={setReceiver}
          placeholder={"Enter Receiver Address"}
        />
        <button
          onClick={() => {
            if (receiver) {
              resetMessages();
              listenMessages(sender, receiver, dispatch);
            }
          }}
          type="button"
          class="bg-f2 text-black3 dark:text-black3 h-8 text-base font-medium shadow-sm rounded-md w-24 ml-4 mt-4"
        >
          {"Start Chat"}
        </button>
      </div>
    </div>
  );
}

function User({
  sender,
  receiver,
  dispatch,
  index,
  setSelected,
  isSelected,
  setReceiver,
}) {
  useEffect(() => {
    let unsubscribe;
    if (isSelected) {
      setReceiver(receiver);
      unsubscribe = listenMessages(sender, receiver, dispatch);
    }

    return () => {
      if (isFunction(unsubscribe)) unsubscribe();
    };
  }, [isSelected]);

  return (
    <button
      type={"button"}
      onClick={() => {
        if (!isSelected) {
          dispatch(resetMessages());
          setSelected(index);
        }
      }}
    >
      <li
        index={index}
        class={`flex h-12 justify-center items-center bg-white10 shadow divide-y overflow-hidden mb-2 text-center ${
          isSelected ? "text-green" : "text-white0 "
        }`}
      >
        <div class="flex-1 flex flex-col">
          <div className="flex flex-row justify-center items-center text-[12px] capitalize">
            {truncate(receiver, 16)}
            <button
              type={"button"}
              onClick={() => navigator.clipboard.writeText(receiver)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 ml-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </button>
          </div>
        </div>
      </li>
    </button>
  );
}

function Users({ users, sender, dispatch, setReceiver, setModalState, selected, setSelected }) {

  return (
    <ul role="list" class="flex flex-[2] mx-10 flex-col px-4 py-8 bg-white10">
      {/* <button
        onClick={() => getAllQueues(sender, dispatch)}
        type="button"
        class="flex bg-green text-black3 h-8 text-sm shadow-sm rounded-md mb-6 justify-center items-center"
      >
        {"Refresh Chats"}
      </button> */}
      <button
        onClick={() => setModalState(true)}
        type="button"
        class="flex mb-6 justify-center items-center border-themepink border-2 border-solid w-full bg-white10 text-themepink h-12 rounded-sm cursor-pointer"
      >
        {"New"}
      </button>
      {Object.keys(users)
        // .reverse()
        ?.map((item, index) => {
          const addresses = item.split("_");
          const receiver =
            addresses[0] === sender ? addresses[1] : addresses[0];
          return (
            <User
              key={item}
              sender={sender}
              receiver={receiver}
              dispatch={dispatch}
              isSelected={selected === index}
              index={index}
              setSelected={setSelected}
              setReceiver={setReceiver}
            />
          );
        })}
    </ul>
  );
}

function SendMessageSection({
  message,
  setMsgString,
  sender,
  receiver,
  dispatch,
}) {
  return (
    <form
      className="mt-2"
      onSubmit={(e) => {
        e.preventDefault();
        setMsgString("");
        saveMessage(message, sender, receiver, dispatch);
      }}
    >
      <div className="flex w-full h-14 p-[6px] justify-evenly items-center">
        <input
          value={message}
          type="text"
          name="search"
          autoComplete="off"
          id="search"
          class="w-[90%] h-full outline-none text-black placeholder:text-black rounded-sm bg-white0 pl-4"
          placeholder={"Start Typing..."}
          onChange={(e) => setMsgString(e.target.value)}
          onKeyPress={(event) => {
            event.key === "Enter" && saveMessage();}}
        />
        <button
          onClick={() => {
            setMsgString("");
            saveMessage(message, sender, receiver, dispatch);
          }}
          type="button"
          class="h-12"
        >
         <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="36" height="36" rx="18" fill="white"/>
          <g opacity="0.8">
          <path d="M29.2972 17.4755L11.1682 8.44869C10.9864 8.36279 10.764 8.38423 10.6023 8.5346C10.4406 8.66368 10.3597 8.87851 10.4203 9.09348L11.7744 14.66C11.8755 15.0468 12.1382 15.3478 12.502 15.4552L19.0301 17.5616C19.4141 17.6905 19.4141 18.2708 19.0301 18.3998L12.4818 20.506C12.1181 20.6135 11.8553 20.9144 11.7542 21.3012L10.4203 26.8892C10.3597 27.1042 10.4404 27.3406 10.6021 27.4695C10.7032 27.5554 10.8245 27.5984 10.9457 27.5984C11.0265 27.5984 11.1074 27.577 11.168 27.534L29.297 18.5072C29.4789 18.4213 29.6001 18.2063 29.6001 17.9913C29.6003 17.7763 29.479 17.5615 29.2972 17.4755L29.2972 17.4755Z" fill="#CA7C86"/>
          </g>
         </svg>

        </button>
      </div>
    </form>
  );
}

function Messages({ message, setMsgString, sender, receiver, dispatch }) {
  const messages = useSelector((state) => state.messages?.messages);
  return (
    <ul role="list" class="flex flex-[5] flex-col scroll-hide pb-2 bg-white10 w-full h-full">
    <div className='chat-name h-10 bg-white10 text-green pt-2 pl-2 text-[14px]'>
      {receiver}
    </div>
      <div className="flex flex-1 flex-col-reverse overflow-scroll px-2">
        {messages === null && (
          <div className="text-white0 text-lg font-medium capitalize mt-8 flex justify-center mb-24">
            {"This is the beginning of chat, send a message"}
          </div>
        )}
        {messages?.map(({ text, name, timestamp }, index) => {
          return (
            <div>
              {/* <li
                key={index}
                class={`flex overflow-hidden w-full px-2 pb-2 ${
                  name === sender ? "justify-end" : "justify-start"
                }`}
              > */}
                <div class={`flex flex-col text-[12px] h-auto ${
                  name === sender ? "items-end text-white0" : "items-start text-green"
                } `}>
                  <div className="min-w-min max-w-xs bg-white10 p-2 break-words2 rounded-sm">
                    {text}
                  </div>
                  {timestamp?.seconds && (
                    <div className="text-white3 text-[11px] capitalize p-2">
                      {getDateTime(timestamp?.seconds)}
                    </div>
                  )}
                </div>
              {/* </li> */}
            </div>
          );
        })}
        
      </div>
      <SendMessageSection
        message={message}
        setMsgString={setMsgString}
        sender={sender}
        receiver={receiver}
        dispatch={dispatch}
      />
    </ul>
  );
}

export default function Chat() {
  const [message, setMsgString] = useState("");
  const [receiver, setReceiver] = useState("");
  const [selected, setSelected] = useState(0);
  const [modal, setModalState] = useState(false);
  const [signModal, setSignModalState] = useState(false);
  const sender = useSelector((state) => state.wallet.address);
  const chainId = useSelector((state) => state.wallet.chainId);
  const queue_ids = useSelector((state) => state.messages?.queue_ids);
  const signatureData = useSelector((state) => state.messages?.signatureData);
  const dispatch = useDispatch();

  useEffect(() => {
    if (sender && (!signatureData || !signatureData?.signature)) {
      dispatch(showLoader());
      getSignatureData(sender, dispatch);
    }
  }, [sender]);

  if (!sender) {
    return (
      <div class="h-screen w-screen bg-globaltheme">
        <div className="text-white0 text-base font-medium text-[30px] capitalize mt-8 flex justify-center">
          {"Connect your wallet first"}
        </div>
      </div>
    );
  }

  if (chainId != 4) {
    return (
      <div class="h-screen w-screen bg-globaltheme">
        <div className="text-white0 text-base font-medium text-[30px] capitalize mt-8 flex justify-center">
          {"Wrong Network connect to Rinkeby network"}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col p-2 min-h-0 bg-globaltheme">
      <div className="flex flex-1 h-full mt-5 mb-10 ml-20">
        {signatureData && signatureData?.signature && queue_ids && sender ? (
          <>
            <Users
              users={queue_ids}
              sender={sender}
              dispatch={dispatch}
              setReceiver={setReceiver}
              setModalState={setModalState}
              modal={modal}
              selected={selected}
              setSelected={setSelected}
            />
            <div className="w-[1px] bg-black7 opacity-20" />
            <Messages
              message={message}
              setMsgString={setMsgString}
              sender={sender}
              receiver={receiver}
              dispatch={dispatch}
            />
            <div className="w-[1px] bg-black7 opacity-20" />
            <div className="flex flex-[6] flex-col">
              {/* <Trade sender={sender} receiver={receiver} /> */}
              <Order sender={sender} truncate={truncate}/>
            </div>
          </>
        ) : (
          <div className="flex flex-1 w-full h-full justify-center items-center flex-col">
            <div className="text-white0 text-xl font-bold mb-8 p-2">
              {"You don't have any conversations!"}
            </div>
            <button
              onClick={() => {
                if (signatureData && signatureData?.signature) {
                  setModalState(true);
                } else {
                  setSignModalState(true);
                }
              }}
              type="button"
              class={
                "flex bg-white10 text-white0 h-10 w-72 text-base shadow-sm rounded-md justify-center items-center"
              }
            >
              {"Start New Chat"}
            </button>
          </div>
        )}
      </div>
      {modal && (
        <NewChatModal
          saveMessage={saveMessage}
          sender={sender}
          dispatch={dispatch}
          setModalState={setModalState}
          getAllQueues={getAllQueues}
          
        />
      )}
      {signModal && (
        <SigningModal
          signMessage={signMessage}
          sender={sender}
          setSignModalState={setSignModalState}
          dispatch={dispatch}
          setSelected = {setSelected}
        />
      )}
    </div>
  );
}

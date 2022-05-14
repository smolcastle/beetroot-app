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
  resetMessages,
  updateMessage,
  updateMessages,
  updateQueueIds,
  updateSignatureData,
} from "../actions/actions";
import Search from "../components/Search";
import { isFunction, truncate } from "../helpers/Collections";
import NewChatModal from "../components/NewChatModal";
import Provider from "../utils/Provider";
import SigningModal from "../components/SigningModal";
import { ethers } from "ethers";

const arr = ["a", "b", "c", "d"];

// Saves a new message to Cloud Firestore.
async function saveMessage(messageText, sender, receiver, dispatch) {
  console.log(
    sender > receiver ? `${receiver}_${sender}` : `${sender}_${receiver}`
  );
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
}

// Loads chat messages history and listens for upcoming ones.
function listenMessages(sender, receiver, dispatch) {
  console.log(
    sender > receiver ? `${receiver}_${sender}` : `${sender}_${receiver}`
  );
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
      console.log(doc.data());
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
      "beetroot",
      signatureData.signedMessage
    );
    if (recoveredAddress === sender) {
      dispatch(updateSignatureData(signatureData));
      getAllQueues(sender, dispatch);
    } else {
      alert("Signature did not match");
    }
  } else {
    console.log("No such document!");
  }
}

async function signMessage(sender, dispatch) {
  try {
    const signedMessage = await Provider.signMessage("beetroot");
    const recoveredAddress = ethers.utils.verifyMessage(
      "beetroot",
      signedMessage
    );
    if (recoveredAddress === sender) {
      const signingsRef = collection(getFirestore(), "signings");
      await setDoc(doc(signingsRef, sender), {
        address: sender,
        signedMessage,
        message: "beetroot",
        timestamp: serverTimestamp(),
      });
      getSignatureData(sender, dispatch);
    } else {
      alert("Signature did not match");
    }
  } catch (error) {
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
        class={`flex h-16 justify-center items-center rounded-lg shadow divide-y overflow-hidden mb-2 text-center ${
          isSelected ? "bg-white3" : "bg-white"
        }`}
      >
        <div class="flex-1 flex flex-col">
          <div className="flex flex-row justify-center items-center text-black5 text-[12px] capitalize">
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

function Users({ users, sender, dispatch, setReceiver, setModalState }) {
  const [selected, setSelected] = useState(0);
  return (
    <ul role="list" class="flex flex-[1] flex-col pl-3 pr-6 py-8">
      <button
        onClick={() => getAllQueues(sender, dispatch)}
        type="button"
        class="flex bg-green text-black3 h-8 text-sm shadow-sm rounded-md mb-6 justify-center items-center"
      >
        {"Refresh Chats"}
      </button>
      <button
        onClick={() => setModalState(true)}
        type="button"
        class="flex bg-f2 text-black3 h-8 text-sm shadow-sm rounded-md mb-6 justify-center items-center"
      >
        {"Start New Chat"}
      </button>
      {Object.keys(users)
        .reverse()
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
      <div className="flex w-full h-16 p-[6px] bg-black3 justify-center items-center">
        <input
          value={message}
          type="text"
          name="search"
          autoComplete="off"
          id="search"
          class="w-full h-full outline-none text-black5 placeholder:text-black6 bg-white4 pl-4"
          placeholder={"Write a message"}
          onChange={(e) => setMsgString(e.target.value)}
        />
        <button
          onClick={() => {
            setMsgString("");
            saveMessage(message, sender, receiver, dispatch);
          }}
          type="button"
          class="bg-f2 text-black3 dark:text-black3 h-12 text-base font-medium shadow-sm rounded-md w-24 ml-2"
        >
          {"Send"}
        </button>
      </div>
    </form>
  );
}

function Messages({ message, setMsgString, sender, receiver, dispatch }) {
  const messages = useSelector((state) => state.messages?.messages);
  return (
    <ul role="list" class="flex flex-[4] flex-col py-2 w-full h-full">
      <div className="flex flex-1 flex-col-reverse overflow-scroll px-4">
        {messages === null && (
          <div className="text-black1 text-xl font-medium capitalize mt-8 flex justify-center mb-24">
            {"This is the beginning of chat, send a message"}
          </div>
        )}
        {messages?.map(({ text, name, timestamp }, index) => {
          console.log(timestamp);
          return (
            <div>
              <li
                key={index}
                class={`flex flex-row text-center divide-y overflow-hidden w-full px-2 pb-2 ${
                  name === sender ? "justify-end" : "justify-start"
                }`}
              >
                <div class="flex flex-col max-w-[80%] bg-nord-dark3 rounded-md shadow justify-center px-4">
                  <div className="text-white3 text-[12px] capitalize p-2">
                    {text}
                  </div>
                  <div className="text-white3 text-[12px] capitalize p-2">
                    {new Date(timestamp.seconds).getTime().toString()}
                  </div>
                </div>
              </li>
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
  const [modal, setModalState] = useState(false);
  const [signModal, setSignModalState] = useState(false);
  const sender = useSelector((state) => state.wallet.address);
  const queue_ids = useSelector((state) => state.messages?.queue_ids);
  const signatureData = useSelector((state) => state.messages?.signatureData);
  const dispatch = useDispatch();

  useEffect(() => {
    if (sender && (!signatureData || !signatureData?.signedMessage)) {
      getSignatureData(sender, dispatch);
    }
  }, [sender]);

  if (!sender) {
    return (
      <div className="text-black1 text-sm font-medium capitalize mt-8 flex justify-center">
        {"Connect your wallet first"}
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col h-full p-2">
      <div className="flex flex-1 w-full h-full">
        {signatureData &&
        signatureData?.signedMessage &&
        queue_ids &&
        sender ? (
          <>
            <Users
              users={queue_ids}
              sender={sender}
              dispatch={dispatch}
              setReceiver={setReceiver}
              setModalState={setModalState}
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
            <div className="flex flex-[6] flex-col p-8" />
          </>
        ) : (
          <div className="flex flex-1 w-full h-full justify-center items-center flex-col">
            <div className="text-black4 text-xl font-bold mb-8 p-2">
              {"You don't have any conversations!"}
            </div>
            <button
              onClick={() => {
                if (signatureData && signatureData?.signedMessage) {
                  setModalState(true);
                } else {
                  setSignModalState(true);
                }
              }}
              type="button"
              class={
                "flex bg-f2 text-black3 h-10 w-72 text-base shadow-sm rounded-md justify-center items-center"
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
        />
      )}
    </div>
  );
}

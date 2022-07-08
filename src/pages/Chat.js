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
  updateMessages,
  updateQueueIds,
  updateSignatureData,
} from "../actions/actions";
import { getDateTime, isFunction, truncate } from "../helpers/Collections";
import NewChatModal from "../components/NewChatModal";
import Provider from "../utils/Provider";
import SigningModal from "../components/SigningModal";
import { ethers } from "ethers";
import { generateNonce, SiweMessage } from "siwe";
import Order from "./Order";
import { useAccount } from "wagmi";
import profile from '../img/profile.png'
import { useNetwork, useSwitchNetwork } from 'wagmi'

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
      receiver: receiver.toLowerCase(),
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

async function getSignatureData(sender , dispatch) {
  const signRef = doc(getFirestore(), "signings", sender);
  const signatureDataSnap = await getDoc(signRef);
  if (signatureDataSnap.exists()) {
    const signatureData = signatureDataSnap.data();
    const recoveredAddress = ethers.utils.verifyMessage(
      signatureData.message,
      signatureData.signature
    );
    if (recoveredAddress.toLowerCase() === sender) {
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

async function signMessage(sender, dispatch, chainId, signer) {
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
    const signature = await Provider.signMessage(msgStr, signer);
    const recoveredAddress = (ethers.utils.verifyMessage(msgStr, signature)).toLowerCase();
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
      alert("Signature didn't match");
    }
  } catch (error) {
    dispatch(hideLoader());
    console.error("Error writing new message to Firebase Database", error);
  }
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
        class={`flex h-[80px] justify-center rounded-[8px] items-center text-gray1 divide-y mb-2 text-center ${
          isSelected ? "bg-gray6" : " "
        }`}
      >
        <div class="flex-1 flex items-center p-3">
          <div className="w-[30%]">
            <img src={profile} className='w-[48px]'></img>
          </div>
          <div className="flex flex-col items-start w-[50%] ">
            <p className="text-[16px]">{truncate(receiver, 10)}</p>
            <p className="text-[14px] text-parsley">verified</p>
          </div>
          <div className="flex flex-col items-end w-[20%]">
            <div className="bg-gumtint text-[12px] min-w-[40%] min-h-[40%] w-auto h-auto text-gum rounded-[50%]"><p>4</p></div>
            <p className=" text-[14px] text-gray3">12:00</p>
          </div>
        </div>
      </li>
    </button>
  );
}

function Users({ users, sender, dispatch, setReceiver, setModalState, selected, setSelected, modal, setNewModalState }) {

  return (
    <ul role="list" class="flex flex-[2] mx-10 flex-col px-4 py-5 bg-white10">
      {/* <button
        onClick={() => setModalState(true)}
        type="button"
        class="flex mb-6 justify-center items-center text-white0 text-[16px] w-full bg-green1 h-12 rounded-sm cursor-pointer"
      >
        {"New"}
      </button> */}
      <div className="bg-gray6 flex rounded-lg py-3 px-4 justify-between items-center mb-5">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7.57137 14.2859C11.2795 14.2859 14.2856 11.2798 14.2856 7.57167C14.2856 3.86349 11.2795 0.857422 7.57137 0.857422C3.86319 0.857422 0.857117 3.86349 0.857117 7.57167C0.857117 11.2798 3.86319 14.2859 7.57137 14.2859Z" fill="#EED3DC" stroke="#AB224E" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M15.1429 15.1432L12.3238 12.3242" stroke="#AB224E" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <input className="bg-gray6 mx-4 outline-none" placeholder="Search or add contacts"></input>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1.09696 11.7358C1.27312 13.3823 2.59735 14.7065 4.24301 14.8899C6.77077 15.1717 9.22916 15.1717 11.7569 14.8899C13.4026 14.7065 14.7268 13.3823 14.9029 11.7358C15.033 10.5203 15.1428 9.2725 15.1428 8.00031C15.1428 6.72814 15.033 5.4803 14.9029 4.26486C14.7268 2.61841 13.4026 1.29417 11.7569 1.11073C9.22916 0.828975 6.77077 0.828975 4.24301 1.11073C2.59735 1.29417 1.27312 2.61841 1.09696 4.26486C0.966926 5.4803 0.857117 6.72814 0.857117 8.00031C0.857117 9.2725 0.966927 10.5203 1.09696 11.7358Z" fill="#EED3DC" stroke="#AB224E"/>
          <path d="M8 5.14258V10.8569" stroke="#AB224E" stroke-linecap="round"/>
          <path d="M10.8572 8H5.14288" stroke="#AB224E" stroke-linecap="round"/>
        </svg>
      </div>
      {Object.keys(users)
        // .reverse()
        ?.map((item, index) => {
          const addresses = item.split("_");
          const receiver =
            addresses[0] === sender ? addresses[1] : addresses[0];
          return (
            <>
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
            {modal && (
              <NewChatModal
                saveMessage={saveMessage}
                sender={sender}
                dispatch={dispatch}
                setModalState={setModalState}
                setNewModalState={setNewModalState}
                getAllQueues={getAllQueues}
                setSelected = {setSelected}
                isSelected={selected === index}
                index={index}
              />
            )}
            </>
          );
        })}
    </ul>
  );
}

function TopSection({ sender, receiver, setReceiver, dispatch }) {
  return (
    <div class="flex-4 rounded-lg flex items-center p-3 h-[80px] bg-gray6">
      <div className="w-[15%]">
        <img src={profile} className='w-[48px]'></img>
      </div>
      <div className="flex flex-col items-start w-[20%] ">
        <div className="flex">
          <p className="text-[16px] mr-2">{truncate(receiver, 10)}</p>
          <button
            type={"button"}
            onClick={() => navigator.clipboard.writeText(receiver)}
          >
         <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M11.009 13.3529C11.0856 12.1296 11.1258 10.8621 11.1258 9.56334C11.1258 9.03718 11.1192 8.51614 11.1063 8.00109C11.0971 7.63659 10.9789 7.28235 10.7631 6.98844C9.94668 5.8765 9.29559 5.1844 8.22401 4.35709C7.92735 4.12804 7.56324 4.00381 7.18854 3.99564C6.8158 3.98752 6.42656 3.9834 6.01086 3.9834C4.75229 3.9834 3.73638 4.0212 2.68593 4.09325C1.78486 4.15506 1.06921 4.87243 1.01276 5.77386C0.936163 6.99714 0.895905 8.26463 0.895905 9.56334C0.895905 10.8621 0.936163 12.1296 1.01276 13.3529C1.06921 14.2542 1.78486 14.9716 2.68593 15.0334C3.73638 15.1054 4.75229 15.1433 6.01086 15.1433C7.26944 15.1433 8.28534 15.1054 9.33578 15.0334C10.2369 14.9716 10.9525 14.2542 11.009 13.3529Z" fill="#EED3DC" stroke="#AB224E"/>
<path d="M14.9872 10.2269C15.0639 9.00359 15.1041 7.73608 15.1041 6.43738C15.1041 5.91122 15.0975 5.39018 15.0846 4.87512C15.0754 4.51061 14.9572 4.15637 14.7414 3.86246C13.9249 2.75052 13.2738 2.05843 12.2023 1.23111C11.9056 1.00207 11.5415 0.877831 11.1668 0.869668C10.7941 0.861546 10.4049 0.857422 9.98917 0.857422C8.73058 0.857422 7.71469 0.89523 6.66424 0.967281C5.76317 1.02909 5.04751 1.74645 4.99106 2.64788C4.91446 3.87116 4.87421 5.13866 4.87421 6.43738C4.87421 7.73608 4.91447 9.00359 4.99106 10.2269C5.04751 11.1283 5.76317 11.8457 6.66424 11.9075C7.71469 11.9795 8.73058 12.0173 9.98917 12.0173C11.2477 12.0173 12.2637 11.9795 13.3141 11.9075C14.2152 11.8457 14.9309 11.1283 14.9872 10.2269Z" fill="white" stroke="#AB224E"/>
</svg>

          </button>
        </div>
        <p className="text-[14px] text-parsley">verified</p>
      </div>
      <div className="flex flex-col items-end w-[20%]">

      </div>
    </div>
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
      <div className="flex w-full h-14 p-[6px] justify-evenly bg-gray6 rounded-lg items-center">
      <button>
      {/* <input type="file" /> */}
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8 15.1431C11.9449 15.1431 15.1429 11.9452 15.1429 8.00028C15.1429 4.05539 11.9449 0.857422 8 0.857422C4.05511 0.857422 0.857147 4.05539 0.857147 8.00028C0.857147 11.9452 4.05511 15.1431 8 15.1431Z" fill="#EED3DC" stroke="#AB224E" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M8 11.2174V4.7832" stroke="#AB224E" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M10.6914 7.09307C9.87362 6.05981 9.31661 5.57897 8.48653 4.95009C8.19282 4.72757 7.80749 4.72757 7.51377 4.95009C6.68369 5.57897 6.12668 6.05981 5.3089 7.09308" stroke="#AB224E" stroke-linecap="round" stroke-linejoin="round"/>
</svg></button>

        <input
          value={message}
          type="text"
          name="search"
          autoComplete="off"
          id="search"
          class="w-[90%] h-full outline-none text-black placeholder:text-black/[0.5] font-inter rounded-sm bg-gray6 pl-4"
          placeholder={"Type your message here"}
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
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14.2619 1.47108C13.5115 0.720689 12.0665 0.565296 6.59713 2.811C2.78529 4.37615 0.583448 5.30298 0.969117 7.68861C1.13848 8.73622 2.21637 10.3446 3.42852 11.6379V13.9883C3.42852 14.9805 4.606 15.5014 5.34015 14.834L6.26707 13.9914C6.92343 14.3984 7.54711 14.6835 8.04444 14.764C10.4301 15.1496 11.3569 12.9477 12.9221 9.13592C15.1678 3.66656 15.0123 2.22148 14.2619 1.47108Z" fill="white"/>
            <path d="M14.2619 1.47108C13.5115 0.720689 12.0665 0.565296 6.59713 2.811C2.78529 4.37615 0.583448 5.30298 0.969117 7.68861C1.13848 8.73622 2.21637 10.3446 3.42852 11.6379V13.9883C3.42852 14.9805 4.606 15.5014 5.34015 14.834L6.26707 13.9914C6.92343 14.3984 7.54711 14.6835 8.04443 14.764C10.4301 15.1496 11.3569 12.9477 12.9221 9.13592C15.1678 3.66656 15.0123 2.22148 14.2619 1.47108Z" stroke="#AB224E" stroke-linejoin="round"/>
            <path d="M14.3658 1.58434L3.12212 11.301C2.03933 10.0746 1.1241 8.64697 0.96917 7.68861C0.583502 5.30298 2.78534 4.37615 6.59718 2.811C12.0665 0.565296 13.5117 0.720689 14.2621 1.47108C14.2981 1.50712 14.3327 1.54474 14.3658 1.58434Z" fill="#EED3DC" stroke="#AB224E" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
    </form>
  );
}

function Messages({ message, setMsgString, sender, receiver, dispatch }) {
  const messages = useSelector((state) => state.messages?.messages);
  return (
    <ul role="list" class="flex flex-[4] flex-col scroll-hide py-5 bg-white10 w-full h-[95%]">
      <TopSection receiver={receiver}/>
      <div className="flex flex-1 flex-col-reverse overflow-scroll px-2">
        {messages === null && (
          <div className="text-gum text-lg font-medium capitalize mt-8 flex justify-center mb-24">
            {"This is the beginning of chat, send a message"}
          </div>
        )}
        {messages?.map(({ text, name, timestamp }, index) => {
          return (
            <div>
                <div class={`flex flex-col text-[14px] h-auto text-white0 m-1 ${
                  name === sender ? "items-end" : "items-start"
                } `}>
                  <div className={`min-w-min max-w-xs p-3 break-words2 rounded-md ${
                  name === sender ? "text-parsley bg-parsleytint" : "text-gum bg-gumtint"
                }`}>
                    {text}
                  </div>
                  {/* {timestamp?.seconds && (
                    <div className="text-white3 text-[11px] capitalize p-2">
                      {getDateTime(timestamp?.seconds)}
                    </div>
                  )} */}
                </div>
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
  const [newModal, setNewModalState] = useState(false);
  const [signModal, setSignModalState] = useState(false);
  const address = useAccount()
  const result = address.address
  const sender = (result || '').toLowerCase();

  const queue_ids = useSelector((state) => state.messages?.queue_ids);
  const signatureData = useSelector((state) => state.messages?.signatureData);
  const dispatch = useDispatch();

  const { chain } = useNetwork()

  useEffect(() => {
    if (sender && (!signatureData || !signatureData?.signature)) {
      dispatch(showLoader());
      getSignatureData(sender, dispatch);
    }
  }, [sender]);


  if (!sender) {
    return (
      <div class="h-screen w-screen bg-white0">
        <div className="text-gum text-base font-medium text-[30px] capitalize mt-8 flex justify-center">
          {"Connect your wallet first"}
        </div>
      </div>
    );
  }


  if (chain.id != 1) {
    return (
      <div class="h-screen w-screen bg-white0">
        <div className="text-parsley text-base font-medium text-[30px] capitalize mt-8 flex justify-center">
          {"Please connect to Ethereum Mainnet"}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col p-2 min-h-0 bg-white0 font-newrubrik overflow-hidden">
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
              setSignModalState={setSignModalState}
              signModal={signModal}
            />
            <Messages
              message={message}
              setMsgString={setMsgString}
              sender={sender}
              receiver={receiver}
              dispatch={dispatch}
            />
            <div className="flex flex-[6] flex-col">
              <Order sender={sender} receiver={receiver} truncate={truncate}/>
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
                  setNewModalState(true);
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

      {signModal && (
        <SigningModal
          signMessage={signMessage}
          sender={sender}
          setSignModalState={setSignModalState}
          dispatch={dispatch}
          chainId={chain.id}
        />
      )}
      {newModal &&
                  <NewChatModal
                  saveMessage={saveMessage}
                  sender={sender}
                  dispatch={dispatch}
                  newModal={newModal}
                  setNewModalState={setNewModalState}
                  getAllQueues={getAllQueues}
                />}
    </div>
  );
}

import React, { useEffect, useState } from 'react';

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
  updateDoc,
  doc,
  serverTimestamp
} from 'firebase/firestore';
import { useDispatch, useSelector } from 'react-redux';
import {
  hideLoader,
  resetMessages,
  showLoader,
  updateMessages,
  updateQueueIds,
  updateSignatureData,
  showNewUser,
  hideNewUser,
  updateUsers,
  updateReceiverContacts,
  updateMsgTime
} from '../actions/actions';
import { getDateTime, isFunction, truncate } from '../helpers/Collections';
import Provider from '../utils/Provider';
import SigningModal from '../components/SigningModal';
import { ethers } from 'ethers';
import { toEthAddress, toEns } from '../utils/ens';
import { generateNonce, SiweMessage } from 'siwe';
import Order from './Order';
import { useAccount } from 'wagmi';
import profile from '../img/profile.png';
import profile0 from '../img/profile0.png';
import { useNetwork } from 'wagmi';
import firebase from '../utils/firebase';
import storage from '../utils/firebase';
import Onboarding from './Onboarding';
import mascot from '../img/mascot-hands.png';

const db = getFirestore();

async function saveMessage(messageText, sender, receiver, dispatch) {
  if (!messageText?.trim().length) {
    return;
  }
  // Add a new message entry to the Firebase database.
  try {
    await addDoc(collection(db, `address book/ ${sender}/texts`), {
      name: sender,
      text: messageText,
      uid: sender,
      receiver: receiver.toLowerCase(),
      queue_id:
        sender > receiver ? `${receiver}_${sender}` : `${sender}_${receiver}`,
      profilePicUrl: 'https://i.pravatar.cc/150?img=3',
      timestamp: serverTimestamp()
    });
    await addDoc(collection(db, `address book/ ${receiver}/texts`), {
      name: sender,
      text: messageText,
      uid: sender,
      receiver: receiver.toLowerCase(),
      queue_id:
        sender > receiver ? `${receiver}_${sender}` : `${sender}_${receiver}`,
      profilePicUrl: 'https://i.pravatar.cc/150?img=3',
      timestamp: serverTimestamp()
    });
  } catch (error) {
    console.error('Error writing new message to Firebase Database', error);
  }
}

async function getAllQueues(sender, dispatch) {
  const queue_ids = {};

  const query1 = query(
    collection(db, `address book/ ${sender}/texts`),
    where('receiver', '==', sender),
    orderBy('timestamp', 'asc')
  );

  const query2 = query(
    collection(db, `address book/ ${sender}/texts`),
    where('name', '==', sender),
    orderBy('timestamp', 'asc')
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
    collection(db, `address book/ ${sender}/texts`),
    // where(
    //   "queue_id",
    //   "==",
    //   sender > receiver ? `${receiver}_${sender}` : `${sender}_${receiver}`
    // ),
    orderBy('timestamp', 'desc'),
    limit(50)
  );

  const unsubscribe = onSnapshot(recentMessagesQuery, (querySnapshot) => {
    const messages = [];
    querySnapshot.forEach((doc) => {
      messages.push({ ...doc.data(), id: doc.id });
    });
    // console.log(messages)
    dispatch(updateMessages(messages.length ? messages : null));
  });
  return unsubscribe;
}

async function getSignatureData(sender, dispatch) {
  const signRef = doc(getFirestore(), 'signings', sender);
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
      alert('Signature did not match');
    }
  } else {
    dispatch(hideLoader());
    console.log('No such document!');
  }
}

async function signMessage(sender, dispatch, chainId, signer) {
  try {
    dispatch(showLoader());
    const nonce = generateNonce();
    const message = new SiweMessage({
      domain: window.location.host,
      address: sender,
      statement: 'Sign in with Ethereum to the app.',
      uri: window.location.origin,
      version: '1',
      chainId,
      nonce
    });
    const msgStr = message.prepareMessage();
    const signature = await Provider.signMessage(msgStr, signer);
    const recoveredAddress = ethers.utils
      .verifyMessage(msgStr, signature)
      .toLowerCase();
    if (recoveredAddress === sender) {
      const signingsRef = collection(getFirestore(), 'signings');
      await setDoc(doc(signingsRef, sender), {
        address: sender,
        signature,
        message: msgStr,
        timestamp: serverTimestamp()
      });
      getSignatureData(sender, dispatch);
    } else {
      dispatch(hideLoader());
      alert("Signature didn't match");
    }
  } catch (error) {
    dispatch(hideLoader());
    console.error('Error writing new message to Firebase Database', error);
  }
}

async function saveUser(sender) {
  try {
    await setDoc(doc(db, `users/${sender}`), {
      name: `${sender}`,
      has_onboarded: false,
      has_skipped: false,
      verified: false,
      telegram: '',
      email: '',
      profilePic: '',
      timestamp: serverTimestamp()
    });
  } catch (error) {
    console.error('Error writing new user to Firebase Database', error);
  }
}
async function getUsers(dispatch) {
  try {
    const users = await getDocs(collection(getFirestore(), 'users'));
    dispatch(
      updateUsers(users.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
    );
  } catch (error) {
    console.error('Error getting users from Firebase Database', error);
  }
}

async function createContact(newUser, sender) {
  try {
    await addDoc(collection(db, `address book/ ${sender}/contacts`), {
      from: sender,
      to: newUser,
      timestamp: serverTimestamp()
    });
  } catch (e) {
    console.log('Error creating new contact', e);
  }
}

async function getContacts(sender, setContacts) {
  try {
    const contactsRef = collection(db, `address book/ ${sender}/contacts`);
    const q = query(contactsRef, orderBy('timestamp', 'desc'));
    onSnapshot(q, (querySnapshot) => {
      let contacts = [];
      querySnapshot.forEach((doc) => {
        contacts.push(doc.data());
      });
      setContacts(contacts);
    });
  } catch (e) {
    console.log(e);
  }
}

async function getReceiverContacts(receiver, dispatch) {
  if (receiver) {
    try {
      const contactsRef = collection(db, 'address book', receiver, 'contacts');
      const q = query(contactsRef, orderBy('timestamp', 'asc'));
      onSnapshot(q, (querySnapshot) => {
        let receiverContacts = [];
        querySnapshot.forEach((doc) => {
          receiverContacts.push(doc.data());
        });
        dispatch(updateReceiverContacts(receiverContacts));
      });
    } catch (e) {
      console.log(e);
    }
  }
}

async function createLastMsgTime(sender, receiver) {
  const id =
    sender > receiver ? `${receiver}_${sender}` : `${sender}_${receiver}`;
  try {
    const msgTimeRef = doc(db, `lastMsg`, id);
    const msgTimeSnap = await getDoc(msgTimeRef);
    if (msgTimeSnap.exists()) {
      await updateDoc(msgTimeRef, {
        timestamp: serverTimestamp()
      });
      return;
    } else {
      await setDoc(doc(db, `lastMsg`, id), {
        sender: sender,
        receiver: receiver,
        timestamp: serverTimestamp()
      });
    }
  } catch (e) {
    console.log('Error', e);
  }
}

async function getLastMsgTime(dispatch) {
  try {
    const msgTimeRef = collection(db, `lastMsg`);
    const q = query(msgTimeRef, orderBy('timestamp', 'asc'));
    onSnapshot(q, (querySnapshot) => {
      let msgTime = [];
      querySnapshot.forEach((doc) => {
        msgTime.push(doc.data());
      });
      dispatch(updateMsgTime(msgTime));
    });
  } catch (e) {
    console.log(e);
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
  setSearchTerm
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

  const [isVerified, setIsVerified] = useState();

  async function getVerifedData() {
    const verifyRef = doc(getFirestore(), `users/${receiver}`);
    const verify = await getDoc(verifyRef);
    if (verify.exists()) {
      const verifyData = verify.data();
      setIsVerified(verifyData.verified);
    } else {
      setIsVerified(false);
    }
  }

  const [lastMsgTime, setLastMsgTime] = useState();
  const msgTime = useSelector((state) => state.messages.msgTime);

  async function fetchLastMsgTime() {
    msgTime.map((lastMsg) => {
      if (
        (lastMsg.receiver === receiver && lastMsg.sender === sender) ||
        (lastMsg.receiver === sender && lastMsg.sender === receiver)
      ) {
        setLastMsgTime(lastMsg.timestamp);
        return;
      }
    });
  }

  const [ensName, setEnsName] = useState('');
  async function getEnsName() {
    let ens = await toEns(receiver);
    setEnsName(ens);
  }

  useEffect(() => {
    getVerifedData();
    getEnsName();
    fetchLastMsgTime();
  });
  let timeout;
  const [hover, setHover] = useState(false);
  const onHover = () => {
    timeout = setTimeout(() => {
      setHover(true);
    }, 1000);
  };

  const onLeave = () => {
    setHover(false);
    clearTimeout(timeout);
  };

  return (
    <>
      <button
        type={'button'}
        onClick={() => {
          if (!isSelected) {
            dispatch(resetMessages());
            setSelected(index);
          }
          setSearchTerm('');
        }}
        className="w-[99%]"
      >
        {hover && (
          <p className="absolute right-0 text-[8px] w-[70%] px-2 py-[5px] rounded-[4px] text-white0 bg-gray2">
            {receiver}
          </p>
        )}

        <li
          index={index}
          className={`flex h-[80px] justify-center rounded-[8px] items-center text-gray1 divide-y mb-2 text-center ${
            isSelected ? 'bg-gray6' : ' '
          }`}
        >
          <div className="flex-1 flex items-center p-3">
            <div className="w-[30%]">
              <img src={profile} className="w-[48px]"></img>
            </div>
            <div className="flex flex-col items-start w-[50%] mt-2">
              <div onMouseEnter={onHover} onMouseLeave={onLeave}>
                {ensName ? (
                  <p className="text-[16px]">{ensName}</p>
                ) : (
                  <p className="text-[16px]">{truncate(receiver, 14)}</p>
                )}
              </div>
              {isVerified && (
                <p className="text-[14px] text-parsley">Verified</p>
              )}
              {!isVerified && (
                <p className="text-[14px] text-gray3">Unverified</p>
              )}
            </div>
            <div className="flex flex-col items-end w-[20%]">
              <div className="bg-gumtint my-[3px] text-[12px] min-w-[40%] min-h-[40%] w-auto h-auto text-gum rounded-[50%]">
                <p></p>
              </div>
              {lastMsgTime && (
                <p className={`text-[14px] text-gray3`}>
                  {getDateTime(lastMsgTime?.seconds).time}
                </p>
              )}
              {!lastMsgTime && <p className="text-[14px] text-gray3">-</p>}
            </div>
          </div>
        </li>
      </button>
    </>
  );
}

function Users({
  sender,
  dispatch,
  setReceiver,
  users,
  selected,
  queue_ids,
  setSelected,
  contacts,
  setContacts,
  setNewModalState
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddContactBtn, setShowAddContactBtn] = useState(false);

  function AddContactBtn() {
    return (
      <div className="p-[4px]">
        <p className="text-[12px] text-gray2 mb-[8px]">
          This address cannot be found in your address book.
        </p>
        <button
          className="text-gum bg-gumtint text-[12px] p-[10px] rounded-[4px]"
          onClick={() => {
            createContact(searchTerm.toLowerCase(), sender);
            setSearchTerm('');
            setShowAddContactBtn(false);
          }}
        >
          Add to address book
        </button>
      </div>
    );
  }
  let contactExists = false;

  async function addNewUserFunc(searchTerm) {
    let address = await toEthAddress(searchTerm);
    if (address && address !== '' && address.toLowerCase() !== sender) {
      let i;
      for (i = 0; i < contacts.length; i++) {
        if (contacts[i].to.toLowerCase() === address.toLowerCase()) {
          contactExists = true;
          break;
        }
      }
      // if not then save this new contact
      if (contactExists == false) {
        await createContact(address.toLowerCase(), sender);
        getContacts(sender, setContacts);
      }
    } else {
      alert('Please paste an address');
    }
    setSearchTerm('');
    getContacts(sender, setContacts);
    setSelected(0);
  }

  return (
    <ul
      role="list"
      className="flex flex-[2] flex-col px-4 py-5 h-[95%] bg-white10 mr-1 relative"
    >
      <div className="bg-gray6 flex rounded-lg py-3 px-4 justify-between items-center mb-5">
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7.57137 14.2859C11.2795 14.2859 14.2856 11.2798 14.2856 7.57167C14.2856 3.86349 11.2795 0.857422 7.57137 0.857422C3.86319 0.857422 0.857117 3.86349 0.857117 7.57167C0.857117 11.2798 3.86319 14.2859 7.57137 14.2859Z"
            fill="#EED3DC"
            stroke="#AB224E"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M15.1429 15.1432L12.3238 12.3242"
            stroke="#AB224E"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <input
          className="bg-gray6 mx-4 outline-none"
          placeholder="Search / Add"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
          }}
        ></input>
        <button
          onClick={() => {
            addNewUserFunc(searchTerm);
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1.09696 11.7358C1.27312 13.3823 2.59735 14.7065 4.24301 14.8899C6.77077 15.1717 9.22916 15.1717 11.7569 14.8899C13.4026 14.7065 14.7268 13.3823 14.9029 11.7358C15.033 10.5203 15.1428 9.2725 15.1428 8.00031C15.1428 6.72814 15.033 5.4803 14.9029 4.26486C14.7268 2.61841 13.4026 1.29417 11.7569 1.11073C9.22916 0.828975 6.77077 0.828975 4.24301 1.11073C2.59735 1.29417 1.27312 2.61841 1.09696 4.26486C0.966926 5.4803 0.857117 6.72814 0.857117 8.00031C0.857117 9.2725 0.966927 10.5203 1.09696 11.7358Z"
              fill="#EED3DC"
              stroke="#AB224E"
            />
            <path
              d="M8 5.14258V10.8569"
              stroke="#AB224E"
              strokeLinecap="round"
            />
            <path
              d="M10.8572 8H5.14288"
              stroke="#AB224E"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
      <div className="overflow-y-scroll">
        {contacts
          ?.filter((contact) => {
            const receiver = contact.to;
            if (searchTerm === '') {
              return receiver;
            } else if (
              receiver.toLowerCase().startsWith(searchTerm.toLowerCase())
            ) {
              return receiver;
            }
          })
          // .reverse()
          ?.map((contact, index) => {
            if (contact.from === sender) {
              const receiver = contact.to;
              return (
                <>
                  <User
                    key={contact}
                    sender={sender}
                    receiver={receiver}
                    dispatch={dispatch}
                    isSelected={selected === index}
                    index={index}
                    setSelected={setSelected}
                    setReceiver={setReceiver}
                    setSearchTerm={setSearchTerm}
                  />
                </>
              );
            }
          })}
        {showAddContactBtn && <AddContactBtn />}
        {contacts.length == 0 && (
          <>
            <div className="flex flex-col justify-center items-center">
              <img className="w-[40%]" src={mascot}></img>
              <p className="text-gray3 text-[12px] text-center my-[24px] w-[80%]">
                Your address book is empty. Click below to add a new address.
              </p>
              <button
                onClick={() => {
                  dispatch(showNewUser());
                }}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1.64548 17.6032C1.90971 20.073 3.89605 22.0593 6.36455 22.3344C10.1562 22.757 13.8438 22.757 17.6354 22.3344C20.1039 22.0593 22.0903 20.073 22.3544 17.6032C22.5495 15.78 22.7143 13.9083 22.7143 12C22.7143 10.0917 22.5495 8.21997 22.3544 6.39681C22.0903 3.92712 20.1039 1.94076 17.6354 1.66561C13.8438 1.24297 10.1562 1.24297 6.36455 1.66561C3.89605 1.94076 1.90971 3.92712 1.64548 6.39681C1.45042 8.21997 1.28571 10.0917 1.28571 12C1.28571 13.9083 1.45042 15.78 1.64548 17.6032Z"
                    fill="#EED3DC"
                    stroke="#AB224E"
                  />
                  <path
                    d="M12 7.71436V16.2858"
                    stroke="#AB224E"
                    strokeLinecap="round"
                  />
                  <path
                    d="M16.2857 12H7.71429"
                    stroke="#AB224E"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
          </>
        )}
      </div>
    </ul>
  );
}

function TopSection({ receiver }) {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (copied) setCopied(false);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [copied]);

  function Clipboard() {
    return (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M11.009 13.3529C11.0856 12.1296 11.1258 10.8621 11.1258 9.56334C11.1258 9.03718 11.1192 8.51614 11.1063 8.00109C11.0971 7.63659 10.9789 7.28235 10.7631 6.98844C9.94668 5.8765 9.29559 5.1844 8.22401 4.35709C7.92735 4.12804 7.56324 4.00381 7.18854 3.99564C6.8158 3.98752 6.42656 3.9834 6.01086 3.9834C4.75229 3.9834 3.73638 4.0212 2.68593 4.09325C1.78486 4.15506 1.06921 4.87243 1.01276 5.77386C0.936163 6.99714 0.895905 8.26463 0.895905 9.56334C0.895905 10.8621 0.936163 12.1296 1.01276 13.3529C1.06921 14.2542 1.78486 14.9716 2.68593 15.0334C3.73638 15.1054 4.75229 15.1433 6.01086 15.1433C7.26944 15.1433 8.28534 15.1054 9.33578 15.0334C10.2369 14.9716 10.9525 14.2542 11.009 13.3529Z"
          fill="#EED3DC"
          stroke="#AB224E"
        />
        <path
          d="M14.9872 10.2269C15.0639 9.00359 15.1041 7.73608 15.1041 6.43738C15.1041 5.91122 15.0975 5.39018 15.0846 4.87512C15.0754 4.51061 14.9572 4.15637 14.7414 3.86246C13.9249 2.75052 13.2738 2.05843 12.2023 1.23111C11.9056 1.00207 11.5415 0.877831 11.1668 0.869668C10.7941 0.861546 10.4049 0.857422 9.98917 0.857422C8.73058 0.857422 7.71469 0.89523 6.66424 0.967281C5.76317 1.02909 5.04751 1.74645 4.99106 2.64788C4.91446 3.87116 4.87421 5.13866 4.87421 6.43738C4.87421 7.73608 4.91447 9.00359 4.99106 10.2269C5.04751 11.1283 5.76317 11.8457 6.66424 11.9075C7.71469 11.9795 8.73058 12.0173 9.98917 12.0173C11.2477 12.0173 12.2637 11.9795 13.3141 11.9075C14.2152 11.8457 14.9309 11.1283 14.9872 10.2269Z"
          fill="white"
          stroke="#AB224E"
        />
      </svg>
    );
  }

  function Check() {
    return (
      <svg
        width="16"
        height="13"
        viewBox="0 0 16 13"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M5.33328 9.45329L13.7333 1.05329C13.9899 0.836537 14.3188 0.724619 14.6544 0.739909C14.9899 0.755198 15.3073 0.89657 15.5432 1.13576C15.779 1.37495 15.9158 1.69434 15.9264 2.03006C15.9369 2.36579 15.8203 2.69313 15.5999 2.94662L6.26661 12.28C6.01737 12.5243 5.68228 12.6611 5.33328 12.6611C4.98428 12.6611 4.64919 12.5243 4.39995 12.28L0.399947 8.27996C0.179576 8.02646 0.0630028 7.69913 0.0735318 7.3634C0.0840608 7.02767 0.220916 6.70829 0.456738 6.46909C0.69256 6.2299 1.00997 6.08853 1.34552 6.07324C1.68106 6.05795 2.01001 6.16987 2.26661 6.38662L5.33328 9.45329Z"
          fill="#4E7B36"
        />
      </svg>
    );
  }

  const [isVerified, setIsVerified] = useState();

  async function getVerifedData() {
    if (receiver) {
      const verifyRef = doc(getFirestore(), `users/${receiver}`);
      const verify = await getDoc(verifyRef);
      if (verify.exists()) {
        const verifyData = verify.data();
        setIsVerified(verifyData.verified);
      } else {
        setIsVerified(false);
      }
    }
  }

  useEffect(() => {
    getVerifedData();
  }, [receiver]);

  return (
    <>
      {receiver === '' && (
        <div className="flex-4 rounded-lg flex items-center p-3 h-[80px] bg-gray6">
          <div className="w-[15%]">
            <img src={profile0} className="w-[48px]"></img>
          </div>
        </div>
      )}
      {receiver !== '' && (
        <div className="flex-4 rounded-lg flex items-center p-3 h-[80px] bg-gray6">
          <div className="w-[15%]">
            <img src={profile} className="w-[48px]"></img>
          </div>
          <div className="flex flex-col items-start w-[20%] ">
            <div className="flex">
              <p className="text-[16px] mr-2">{truncate(receiver, 14)}</p>
              <button
                type={'button'}
                onClick={() => {
                  navigator.clipboard.writeText(receiver);
                  setCopied(true);
                }}
              >
                {!copied ? <Clipboard /> : <Check />}
              </button>
            </div>
            {isVerified && <p className="text-[14px] text-parsley">Verified</p>}
            {!isVerified && (
              <p className="text-[14px] text-gray3">Unverified</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function AddUser({ dispatch, sender, contacts }) {
  const [newUser, setNewUser] = useState('');
  let contactExists = false;
  async function addNewUserFunc() {
    let address = await toEthAddress(newUser);
    if (address && address !== '' && address.toLowerCase() !== sender) {
      let i;
      for (i = 0; i < contacts.length; i++) {
        if (contacts[i].to.toLowerCase() === address.toLowerCase()) {
          contactExists = true;
          break;
        }
      }
      // if not then save this new contact
      if (contactExists == false) {
        createContact(address.toLowerCase(), sender);
      }
      setNewUser('');
      dispatch(hideNewUser());
    } else {
      alert('Please paste an address');
    }
  }

  return (
    <div className="flex-4 rounded-lg flex items-center p-3 h-[80px] bg-gray6">
      <div className="w-[15%]">
        <img src={profile0} className="w-[48px]"></img>
      </div>
      <div className="flex flex-col items-start w-[20%] ">
        <div className="flex">
          <input
            className="bg-gray6 outline-none w-[150px]"
            placeholder="Address / ENS"
            value={newUser}
            onChange={(e) => setNewUser(e.target.value)}
            onKeyPress={(event) => {
              event.key === 'Enter' && addNewUserFunc();
            }}
          />
          <button
            className="text-gum ml-1"
            onClick={() => {
              dispatch(hideNewUser());
            }}
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M21.04 19.1467C21.2911 19.3978 21.4321 19.7383 21.4321 20.0934C21.4321 20.4484 21.2911 20.789 21.04 21.04C20.7889 21.2911 20.4484 21.4322 20.0933 21.4322C19.7383 21.4322 19.3977 21.2911 19.1467 21.04L15.3867 17.2667L11.6133 21.04C11.3623 21.2911 11.0217 21.4322 10.6667 21.4322C10.3116 21.4322 9.97107 21.2911 9.72 21.04C9.46893 20.789 9.32788 20.4484 9.32788 20.0934C9.32788 19.9176 9.36251 19.7435 9.42979 19.581C9.49707 19.4186 9.59569 19.271 9.72 19.1467L13.4933 15.3867L9.73334 11.6C9.48227 11.349 9.34121 11.0084 9.34121 10.6534C9.34121 10.2983 9.48227 9.95777 9.73334 9.7067C9.98441 9.45563 10.3249 9.31458 10.68 9.31458C11.0351 9.31458 11.3756 9.45563 11.6267 9.7067L15.4 13.48L19.16 9.7067C19.2843 9.58238 19.4319 9.48376 19.5943 9.41648C19.7568 9.3492 19.9309 9.31458 20.1067 9.31458C20.2825 9.31458 20.4566 9.3492 20.619 9.41648C20.7814 9.48376 20.929 9.58238 21.0533 9.7067C21.1777 9.83102 21.2763 9.9786 21.3435 10.141C21.4108 10.3035 21.4455 10.4776 21.4455 10.6534C21.4455 10.8292 21.4108 11.0033 21.3435 11.1657C21.2763 11.3281 21.1777 11.4757 21.0533 11.6L17.28 15.3734L21.0533 19.1334L21.04 19.1467Z"
                fill="#AB224E"
              />
            </svg>
          </button>
        </div>
        <p className="text-[14px] text-gray3">Unverified</p>
      </div>
    </div>
  );
}

function SendMessageSection({
  message,
  setMsgString,
  sender,
  receiver,
  dispatch
}) {
  const receiverContacts = useSelector(
    (state) => state.contacts.receiverContacts
  );
  const userExists = async () => {
    let contactExists = false;
    let i;
    for (i = 0; i < receiverContacts.length; i++) {
      if (receiverContacts[i].to.toLowerCase() === sender) {
        contactExists = true;
        break;
      }
    }

    // if not then save this new contact
    if (contactExists == false) {
      createContact(sender, receiver);
    }
  };

  return (
    <form
      className="mt-2"
      onSubmit={(e) => {
        e.preventDefault();
        setMsgString('');
        saveMessage(message, sender, receiver, dispatch);
        userExists();
        createLastMsgTime(sender, receiver);
      }}
    >
      {receiver === '' && (
        <div className="flex w-full h-14 p-[6px] bg-gray6 rounded-lg items-center">
          <p className="text-black/[0.5] pl-2 text-[14px]">
            Type in search field and add a new address to start messaging
          </p>
        </div>
      )}
      {receiver !== '' && (
        <div className="flex w-full h-14 p-[6px] justify-evenly bg-gray6 rounded-lg items-center">
          <input
            value={message}
            type="text"
            name="search"
            autoComplete="off"
            id="search"
            className="w-[90%] h-full border-none outline-none focus:ring-0 text-black placeholder:text-black/[0.5] font-inter rounded-sm bg-gray6 pl-1"
            placeholder={'Write a message...'}
            onChange={(e) => setMsgString(e.target.value)}
            onKeyPress={(event) => {
              event.key === 'Enter' && saveMessage();
            }}
          />
          <button
            onClick={() => {
              setMsgString('');
              saveMessage(message, sender, receiver, dispatch);
            }}
            type="button"
            className="h-12"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14.2619 1.47108C13.5115 0.720689 12.0665 0.565296 6.59713 2.811C2.78529 4.37615 0.583448 5.30298 0.969117 7.68861C1.13848 8.73622 2.21637 10.3446 3.42852 11.6379V13.9883C3.42852 14.9805 4.606 15.5014 5.34015 14.834L6.26707 13.9914C6.92343 14.3984 7.54711 14.6835 8.04444 14.764C10.4301 15.1496 11.3569 12.9477 12.9221 9.13592C15.1678 3.66656 15.0123 2.22148 14.2619 1.47108Z"
                fill="white"
              />
              <path
                d="M14.2619 1.47108C13.5115 0.720689 12.0665 0.565296 6.59713 2.811C2.78529 4.37615 0.583448 5.30298 0.969117 7.68861C1.13848 8.73622 2.21637 10.3446 3.42852 11.6379V13.9883C3.42852 14.9805 4.606 15.5014 5.34015 14.834L6.26707 13.9914C6.92343 14.3984 7.54711 14.6835 8.04443 14.764C10.4301 15.1496 11.3569 12.9477 12.9221 9.13592C15.1678 3.66656 15.0123 2.22148 14.2619 1.47108Z"
                stroke="#AB224E"
                strokeLinejoin="round"
              />
              <path
                d="M14.3658 1.58434L3.12212 11.301C2.03933 10.0746 1.1241 8.64697 0.96917 7.68861C0.583502 5.30298 2.78534 4.37615 6.59718 2.811C12.0665 0.565296 13.5117 0.720689 14.2621 1.47108C14.2981 1.50712 14.3327 1.54474 14.3658 1.58434Z"
                fill="#EED3DC"
                stroke="#AB224E"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      )}
    </form>
  );
}

function Messages({
  message,
  setMsgString,
  sender,
  receiver,
  dispatch,
  contacts,
  setReceiverContacts,
  receiverContacts
}) {
  const messages = useSelector((state) => state.messages?.messages);
  const newUser = useSelector((state) => state.newUser.showNewUser);
  const [showDelMessage, setShowDelMessage] = useState(null);

  useEffect(() => {
    getReceiverContacts(receiver, dispatch);
  }, [receiver]);

  const chats = [];
  messages?.map((chat) => {
    if (
      chat.queue_id ===
      (sender > receiver ? `${receiver}_${sender}` : `${sender}_${receiver}`)
    ) {
      chats.push(chat);
    }
  });

  const showMessageDetails = (id, index) => {
    messages.map((message) => {
      if (message.id === id) {
        setShowDelMessage(index);
      }
    });
  };
  const hideMessageDetails = (id) => {
    messages.map((message) => {
      if (message.id === id) {
        setShowDelMessage(null);
      }
    });
  };

  return (
    <ul
      role="list"
      className="flex flex-[4] flex-col py-5 bg-white10 w-full relative mx-1"
    >
      <TopSection receiver={receiver} />

      <div className="flex flex-1 flex-col-reverse overflow-y-scroll px-2">
        {messages !== null &&
          chats?.map(({ text, name, timestamp, id }, index) => {
            return (
              <div key={id}>
                <div
                  className={`flex flex-col text-[14px] h-auto text-white0 m-1 ${
                    name === sender ? 'items-end' : 'items-start'
                  } `}
                >
                  <div className="flex items-center">
                    <div
                      onClick={() => {
                        {
                          showDelMessage === index
                            ? hideMessageDetails(id)
                            : showMessageDetails(id, index);
                        }
                      }}
                      key={index}
                      className={`min-w-min max-w-xs p-3 break-words2 rounded-md ${
                        name === sender
                          ? 'text-parsley bg-parsleytint'
                          : 'text-gum bg-gumtint'
                      }`}
                    >
                      {text}
                    </div>
                  </div>
                  {name === sender &&
                    showDelMessage === index &&
                    timestamp?.seconds && (
                      <div className="text-gray3 text-[11px] capitalize p-2 flex w-[120px] justify-between">
                        <p>{getDateTime(timestamp?.seconds).date},</p>
                        <p>{getDateTime(timestamp?.seconds).time} </p>
                        <p>{'(UTC)'}</p>
                      </div>
                    )}
                </div>
              </div>
            );
          })}
        {messages !== null &&
          chats.length === 0 &&
          contacts.length !== 0 &&
          receiver !== '' && (
            <div className="flex flex-col justify-center items-center mt-[20%]">
              <p className="text-[12px] text-gray2 text-center w-[80%]">
                No messages here yet. Send your first message below.
              </p>
            </div>
          )}
      </div>
      {messages === null && contacts.length === 0 && (
        <div className="flex flex-col text-[12px] text-left text-gray2 p-4 mb-4 justify-evenly absolute bottom-[10%] w-full border-dotted border-2">
          <p className="w-[90%]">
            <span className="font-bold">Some useful tips: </span>
            <br />
            Be polite and respectful while communcating with other.
            <br />
            <br />
            <span className="text-parsley font-bold">VERIFIED:</span> A verified
            account on Beetroot has authenticated its address using
            cryptographic signature.
            <br />
            <br />
            <span className="text-gray3 font-bold">UNVERIFIED:</span> This means
            that the address has not yet created an account on Beetroot.
          </p>
        </div>
      )}
      <SendMessageSection
        message={message}
        setMsgString={setMsgString}
        sender={sender}
        receiver={receiver}
        dispatch={dispatch}
        contacts={contacts}
        receiverContacts={receiverContacts}
        setReceiverContacts={setReceiverContacts}
      />
    </ul>
  );
}

export default function Chat() {
  const [message, setMsgString] = useState('');
  const [receiver, setReceiver] = useState('');
  const [selected, setSelected] = useState(0);
  const [modal, setModalState] = useState(false);
  const [newModal, setNewModalState] = useState(false);
  const [signModal, setSignModalState] = useState(false);
  const address = useAccount();
  const result = address.address;
  const sender = (result || '').toLowerCase();
  const queue_ids = useSelector((state) => state.messages?.queue_ids);
  const signatureData = useSelector((state) => state.messages?.signatureData);
  const users = useSelector((state) => state.users?.users);
  const dispatch = useDispatch();
  const { chain } = useNetwork();
  const [contacts, setContacts] = useState([]);
  const [receiverContacts, setReceiverContacts] = useState([]);
  const [onboarded, setOnboarded] = useState(null);

  const funcNewUser = async () => {
    // if users list exist then check if sender already exists in the list
    if ((await users) && sender !== '') {
      const userRef = doc(getFirestore(), `users/${sender}`);
      const user = await getDoc(userRef);
      if (!user.exists()) {
        await saveUser(sender);
        getUsers(dispatch);
        console.log('users not null');
      }
    }
    // if the users list is empty then add the new user
    if ((await users) != null && users.length === 0 && sender !== '') {
      saveUser(sender);
      console.log('users null');
    }
  };

  async function showOnboarding() {
    if (users && sender !== '') {
      const userRef = doc(getFirestore(), `users/${sender}`);
      const user = await getDoc(userRef);
      const userData = user.data();
      if (userData.has_onboarded == false && userData.has_skipped == false) {
        setOnboarded(false);
      } else {
        setOnboarded(true);
      }
    }
  }

  useEffect(() => {
    showOnboarding();
  }, [address]);

  useEffect(() => {
    if (sender && (!signatureData || !signatureData?.signature)) {
      dispatch(showLoader());
      getSignatureData(sender, dispatch);
    }
  }, [sender]);

  useEffect(() => {
    getUsers(dispatch);
  }, []);

  useEffect(() => {
    getLastMsgTime(dispatch);
  }, []);

  useEffect(() => {
    getContacts(sender, setContacts);
    listenMessages(sender, receiver, dispatch);
  }, [sender]);
  useEffect(() => {
    funcNewUser();
  }, [address]);

  if (!sender) {
    return (
      <div className="h-screen w-screen bg-white0">
        <div className="text-gum text-base font-medium text-[30px] capitalize mt-8 flex justify-center">
          {'Connect your wallet first'}
        </div>
      </div>
    );
  }

  if (chain.id != 1) {
    return (
      <div className="h-screen w-screen bg-white0">
        <div className="text-parsley text-base font-medium text-[30px] capitalize mt-8 flex justify-center">
          {'Please connect to Ethereum Mainnet'}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex flex-1 flex-col p-2 min-h-0 bg-white0 font-rubrik overflow-hidden ${
        onboarded == null ? 'hidden' : ''
      }`}
    >
      <div className="flex flex-1 mt-3 h-[95%] pb-5 ml-[16px]">
        {signatureData && signatureData?.signature ? (
          <>
            {users && sender && onboarded ? (
              <>
                <Users
                  sender={sender}
                  dispatch={dispatch}
                  queue_ids={queue_ids}
                  setReceiver={setReceiver}
                  setModalState={setModalState}
                  modal={modal}
                  selected={selected}
                  setSelected={setSelected}
                  setSignModalState={setSignModalState}
                  signModal={signModal}
                  contacts={contacts}
                  setContacts={setContacts}
                />
                <Messages
                  message={message}
                  setMsgString={setMsgString}
                  sender={sender}
                  receiver={receiver}
                  dispatch={dispatch}
                  contacts={contacts}
                  setContacts={setContacts}
                  receiverContacts={receiverContacts}
                  setReceiverContacts={setReceiverContacts}
                />
                <div className="flex flex-[6] flex-col ml-5">
                  <Order
                    sender={sender}
                    receiver={receiver}
                    truncate={truncate}
                  />
                </div>
              </>
            ) : (
              <Onboarding
                users={users}
                sender={sender}
                onboarded={onboarded}
                truncate={truncate}
                setOnboarded={setOnboarded}
              />
            )}{' '}
          </>
        ) : (
          <>
            <SigningModal
              signMessage={signMessage}
              sender={sender}
              setSignModalState={setSignModalState}
              dispatch={dispatch}
              chainId={chain.id}
            />
          </>
        )}
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import Profile from '../components/Profile';
import { doc, getFirestore, getDoc, updateDoc } from 'firebase/firestore';

const Onboarding = ({ onboarded, setOnboarded, sender, truncate, users }) => {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState(null);
  const [later, setLater] = useState(null);

  async function updateUserOnboarded() {
    if (later != null || email != null) {
      try {
        const userRef = doc(getFirestore(), 'users', sender);
        await updateDoc(userRef, {
          has_onboarded: true,
          email: email,
          verified: true
        });
        setOnboarded(true);
      } catch (e) {
        console.log(e);
      }
    } else {
      alert('Please select the following details');
    }
  }
  async function updateUserSkipped() {
    try {
      const userRef = doc(getFirestore(), 'users', sender);
      await updateDoc(userRef, {
        has_skipped: true,
        verified: true
      });
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <>
      <div
        className={`flex justify-center items-center bg-white0 w-screen pl-[4%] overflow-x-hidden`}
      >
        <div className="w-[75%] flex">
          <div className="font-rubrik w-[50%] justify-evenly h-full">
            <span className="font-questa text-gray2 text-[48px] mr-[8px]">
              {'gm'}
            </span>
            <span className="font-questa text-gum text-[48px]">
              {truncate(sender, 14)}!
            </span>
            <p className="text-gray2 w-[70%] mt-[16px]">
              {' '}
              Take a moment to set the following account details before you can
              begin transcating on beetroot.
            </p>
            <p className="text-[12px] mt-[32px] text-gray2">
              Preview Your Profile:
            </p>
            <div className="mt-[8px] flex w-[70%] h-[270px] rounded-[16px] shadow-lg">
              <Profile
                truncate={truncate}
                sender={sender}
                displayName={displayName}
              />
            </div>
            <div className="text-gray1 mt-[64px] pb-[48px]">
              <button
                className="border-b border-gray1 border-solid"
                onClick={() => {
                  updateUserSkipped();
                  setOnboarded(true);
                }}
              >
                Skip
              </button>
              <button
                className="border-b border-gray1 border-solid ml-[16px]"
                onClick={() => {
                  updateUserOnboarded();
                }}
              >
                Done!
              </button>
            </div>
          </div>
          <div className="flex w-[50%] flex-col">
            <div className="flex flex-col mt-[48px] text-gray1">
              <h1 className=" text-[16px]">
                {'Choose how your name will be displayed'}
              </h1>
              <div className="flex justify-start items-center w-[45%]">
                <div className="flex mr-[16px]">
                  <input
                    type="radio"
                    checked
                    className="mr-[4px] border-[1px] border-gum border-solid bg-gumtint checked:text-gum"
                    id="wallet address"
                    value="wallet address"
                    name="display"
                    onChange={(e) => {
                      setDisplayName(e.target.value);
                    }}
                  />
                  <label className="text-[14px]" htmlFor="wallet address">
                    Wallet address
                  </label>
                </div>
                <div className="flex mr-[16px]">
                  <input
                    type="radio"
                    className="mr-[4px] border-[1px] border-gum border-solid bg-gumtint checked:text-gum"
                    id="ens name"
                    value="ens name"
                    name="display"
                    onChange={(e) => {
                      setDisplayName(e.target.value);
                    }}
                  />
                  <label className="text-[14px]" htmlFor="ens name">
                    ENS Name
                  </label>
                </div>
              </div>
            </div>
            <div className="text-gray1 mt-[24px]">
              <h1 className="text-[16px]">
                {'Where would you like to receive your notifications?'}
              </h1>
              <div className="flex mt-[8px]">
                <input
                  type="radio"
                  className="mr-[4px] border-[1px] border-gum border-solid bg-gumtint checked:text-gum"
                  id="email"
                  name="contact"
                />
                <label htmlFor="email" className="text-[14px]">
                  {'Email:'}
                </label>
              </div>
              <div className="flex items-center w-[300px]">
                <input
                  className="outline-none rounded-[4px] w-full mr-[8px] text-[14px] bg-gumtint/[0.2] text-gum placeholder:text-gum/[0.5] p-2"
                  placeholder="Your Email Address"
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                />
              </div>

              <div className="flex mt-[4px]">
                <input
                  type="radio"
                  onClick={() => {
                    setLater(true);
                  }}
                  className="mr-[4px] border-[1px] border-gum border-solid bg-gumtint checked:text-gum"
                  id="later"
                  name="contact"
                />
                <label htmlFor="later" className="text-[14px]">
                  {'Choose later'}
                </label>
              </div>
            </div>
            <div className="text-gray1 mt-[24px]">
              <h1 className="text-[16px]">{'Set a profile picture'}</h1>
              <div className="flex mt-[8px] rounded-md justify-between items-center w-[300px] bg-gray6 p-3">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7.57139 14.2854C11.2796 14.2854 14.2856 11.2794 14.2856 7.57119C14.2856 3.863 11.2796 0.856934 7.57139 0.856934C3.86321 0.856934 0.857143 3.863 0.857143 7.57119C0.857143 11.2794 3.86321 14.2854 7.57139 14.2854Z"
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
                  className="outline-none ml-[8px] rounded-[8px] w-full text-[14px] bg-gray6"
                  placeholder="Type Doodles"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Onboarding;

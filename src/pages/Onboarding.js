import React, { useState, useEffect } from 'react';
import Profile from '../components/Profile';
import { doc, getFirestore, getDoc, updateDoc } from 'firebase/firestore';
import { fetchUserAssets } from '../utils/opensea';
import { showPopUp } from '../actions/actions';
import { useDispatch } from 'react-redux';

const Onboarding = ({ onboarded, setOnboarded, sender, truncate, users }) => {
  const { v4: uuidv4 } = require('uuid'); // to generate unique ids

  const [displayName, setDisplayName] = useState('wallet address');
  const [email, setEmail] = useState(null);
  const [later, setLater] = useState(null);
  const [selectImage, setSelectImage] = useState('');

  const dispatch = useDispatch();

  async function updateUserOnboarded() {
    if (later != null || email != null) {
      try {
        const userRef = doc(getFirestore(), 'users', sender);
        await updateDoc(userRef, {
          has_onboarded: true,
          email: email,
          verified: true,
          profilePic: selectImage
        });
        setOnboarded(true);
      } catch (e) {
        console.log(e);
      }
    } else {
      dispatch(showPopUp('alert', 'Please select the following details'));
    }
  }

  const [userAssets, setUserAssets] = useState([]);

  async function getAssets() {
    if (sender !== '') {
      const getUserAssets = await fetchUserAssets(sender);
      setUserAssets(getUserAssets.assets);
    }
  }

  useEffect(() => {
    getAssets();
  }, [sender]);

  return (
    <>
      <div
        className={`flex justify-center items-center bg-white0 w-screen pl-[4%] overflow-x-hidden`}
      >
        <div className=" flex justify-evenly">
          <div className="font-rubrik justify-evenly h-full">
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
                selectImage={selectImage}
              />
            </div>
            <div className="text-gray1 mt-[64px] pb-[48px]">
              <button
                className="border-b border-gray1 border-solid "
                onClick={() => {
                  updateUserOnboarded();
                }}
              >
                Done!
              </button>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex flex-col mt-[48px] text-gray1">
              <h1 className=" text-[16px]">
                {'Choose how your name will be displayed'}
              </h1>
              <div className="flex justify-start items-center mt-4">
                <div className="flex mr-[16px]">
                  <input
                    type="radio"
                    defaultChecked
                    className="mr-[4px] border-[1px] border-gum border-solid bg-gumtint checked:text-gum"
                    id="wallet address"
                    value="wallet address"
                    name="display"
                    onClick={(e) => {
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
                    onClick={(e) => {
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
              <div className="flex mt-4">
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
              <div className="flex items-center w-[300px] mt-2">
                <input
                  className="outline-none rounded-[4px] w-full mr-[8px] text-[14px] bg-gumtint/[0.2] text-gum placeholder:text-gum/[0.5] p-2"
                  placeholder="Your Email Address"
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                />
              </div>

              <div className="flex mt-4">
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

              <div className="flex mt-4 justify-start max-w-[400px] max-h-[200px] overflow-y-scroll flex-wrap">
                {userAssets.length > 0 ? (
                  userAssets?.map((asset) => {
                    return (
                      <div key={uuidv4()} className="w-[75px] h-[75px]">
                        <img
                          className={`w-[50px] h-[50px] rounded-[4px] ${
                            selectImage === asset.image_url
                              ? 'border-[4px] border-solid border-gum  '
                              : ''
                          }`}
                          src={asset.image_url}
                          onClick={() => {
                            setSelectImage(asset.image_url);
                          }}
                        />
                      </div>
                    );
                  })
                ) : (
                  <p className="text-gray1 text-[12px]">No images found</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Onboarding;

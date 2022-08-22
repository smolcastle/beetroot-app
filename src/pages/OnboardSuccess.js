import React from 'react';
import mascot from '../img/onboarding.png';

const OnboardSuccess = () => {
  return (
    <div className="flex h-screen w-screen pl-[4%] pt-[80px] overflow-x-hidden ">
      <div className="font-rubrik w-[50%] justify-evenly h-full">
        <h1 className="font-questa text-gray2 text-[48px] w-[65%] leading-tight">
          {'You have been successfully onboarded!'}
        </h1>
        <h1 className="font-questa mt-[48px] text-gray2 text-[48px] w-[65%] leading-tight">
          {
            'You can now begin trading NFTs and other assets with fellow crypto enthusiasts!'
          }
        </h1>
        <button className="bg-gumtint border-2 border-gum border-solid text-gum font-rubrik font-bold w-[30%] text-[14px] mt-[48px] rounded-[8px] py-[8px] px-[16px]">
          {'START NOW'}
        </button>
      </div>
      <div className="flex w-[50%] justify-end items-end">
        <img className="fixed" src={mascot}></img>
      </div>
    </div>
  );
};

export default OnboardSuccess;

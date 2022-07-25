import React from 'react'

const OnboardSuccess = () => {
  return (
    <div className='flex h-screen w-screen pl-[12%] pt-[12%] overflow-x-hidden '>
        <div className='font-rubrik w-[50%] justify-evenly h-full'>
            <h1 className='font-questa text-gray2 text-[32px] w-[30%] leading-tight'>
            {"You have been successfully onboarded!"}
            </h1>
            <h1 className='mt-[40px] text-gray2 text-[14px] w-[35%] leading-tight'>
           {"You can now begin chatting with other users to negotiate NFT trades and deals."}
            </h1>
            <button className='border-2 border-gum/[0.8] border-solid text-gum/[0.8] font-rubrik font-bold w-[30%] text-[14px] mt-[40px] rounded-[4px] py-[8px] px-[16px]'>
                {"TAKE A TOUR"}
            </button>
            <p className='text-gray1 text-[14px] mt-[16px]'>or skip tour and dive right in!</p>
        </div>
    </div>
  )
}

export default OnboardSuccess
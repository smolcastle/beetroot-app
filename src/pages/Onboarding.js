import React from 'react'
import mascot from '../img/onboarding.png'

const Onboarding = () => {
  return (
    <div className='flex h-screen w-screen pl-[4%] pt-[48px] overflow-x-hidden '>
        <div className='font-rubrik w-[50%] justify-evenly h-full'>
            <h1 className='font-questa text-gray2 text-[48px] w-[65%] leading-tight'>{"Hello 0x..rgbh!"}<br /> Take a moment to set the following account details before you can begin transcating on beetroot.</h1>
            <div className='flex flex-col mt-[48px] text-gray1'>
                <h1 className='font-semibold text-[16px]'>{"Choose a display name >"}</h1>
                <div className='mt-[8px]'>
                    <input type="radio" name='display'/>
                    <span className='text-[14px]'>{"Wallet address"}</span>
                </div>
                <div className='mt-[4px]'>
                    <input type="radio" name='display'/>
                    <span className='text-[14px]'>{"ENS Name"}</span>
                </div>
            </div>
            <div className='text-gray1 mt-[24px]'>
                <h1 className='font-semibold text-[16px]'>{"Choose where to receive message notifications >"}</h1>
                <div className='mt-[8px]'>
                    <input type="radio" name='contact'/>
                    <span className='text-[14px]'>{"Telegram: @exampleusername"}</span>
                </div>
                <div className='mt-[4px]'>
                    <input type="radio" name='contact'/>
                    <span className='text-[14px]'>{"Email: exampleemail@gmail.com"}</span>
                </div>
                <div className='mt-[4px]'>
                    <input type="radio" name='contact'/>
                    <span className='text-[14px]'>{"Send it at a later date"}</span>
                </div>
            </div>
            <div className='text-gray1 mt-[24px]'>
                <h1 className='font-semibold text-[16px]'>{"Set a profile picture >"}</h1>
                <p className='text-[14px] mt-[8px] w-[30%]'>Choose an NFT owned by your current address to use as a profile picture.</p>
                <div className='flex mt-[8px] rounded-md justify-between items-center bg-gray5 w-[30%] py-[12px] pl-[8px] pr-[16px]'>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7.57137 14.2854C11.2795 14.2854 14.2856 11.2794 14.2856 7.57119C14.2856 3.863 11.2795 0.856934 7.57137 0.856934C3.86319 0.856934 0.857117 3.863 0.857117 7.57119C0.857117 11.2794 3.86319 14.2854 7.57137 14.2854Z" fill="#EED3DC" stroke="#AB224E" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M15.1429 15.1427L12.3238 12.3237" stroke="#AB224E" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <input className='outline-none ml-[-16px] mr-[8px] text-[14px] bg-gray5' placeholder='Search within your NFTs'/>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1.09703 11.7353C1.27318 13.3818 2.59741 14.706 4.24308 14.8895C6.77084 15.1712 9.22922 15.1712 11.7569 14.8895C13.4027 14.706 14.7269 13.3818 14.903 11.7353C15.0331 10.5198 15.1429 9.27201 15.1429 7.99983C15.1429 6.72765 15.0331 5.47982 14.903 4.26437C14.7269 2.61792 13.4027 1.29368 11.7569 1.11024C9.22922 0.828487 6.77084 0.828487 4.24308 1.11024C2.59741 1.29368 1.27318 2.61792 1.09703 4.26437C0.966987 5.47982 0.857178 6.72765 0.857178 7.99983C0.857178 9.27201 0.966988 10.5198 1.09703 11.7353Z" fill="#EED3DC" stroke="#AB224E"/>
                        <path d="M10.0204 5.97949L5.97974 10.0201" stroke="#AB224E" stroke-linecap="round"/>
                        <path d="M10.0204 10.0201L5.97974 5.97949" stroke="#AB224E" stroke-linecap="round"/>
                    </svg>
                </div>
            </div>
            <div className='mt-[24px]'>
                <h1>Your NFTs</h1>
                <div className='h-[200px]'></div>
            </div>
            <div className='text-gray1 pb-[48px]'>
                <button className='border-b border-gray1 border-solid'>Skip</button>
                <button className='border-b border-gray1 border-solid ml-[16px]'>Next</button>
            </div>
        </div>
        <div className='flex w-[50%] justify-end items-end'>
            <img className='fixed' src={mascot}></img>
        </div>
    </div>
  )
}

export default Onboarding
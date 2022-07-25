import React from 'react'
import Profile from '../components/Profile'

const Onboarding = () => {

  return (
    <div className='flex justify-center items-center bg-white0 h-screen w-screen pl-[4%] pt-[40px] overflow-x-hidden '>
        <div className='w-[75%] flex'>
        <div className='font-rubrik w-[50%] justify-evenly h-full'>
            <span className='font-questa text-gray2 text-[48px]'>{"gm"}</span>
            <span className='font-questa text-gum text-[48px]'>{" 0xabc..rgbh!"}</span>
            <p className='text-gray2 w-[70%] mt-[16px]'> Take a moment to set the following account details before you can begin transcating on beetroot.</p>
            <p className='text-[12px] mt-[32px] text-gray2'>Preview Your Profile:</p>
            <div className='mt-[8px] flex w-[70%] h-[270px] rounded-[16px] shadow-lg'>
                <Profile />
            </div>
            <div className='text-gray1 mt-[64px] pb-[48px]'>
                <button className='border-b border-gray1 border-solid'>Skip</button>
                <button className='border-b border-gray1 border-solid ml-[16px]'>Next</button>
            </div>
        </div>
        <div className='flex w-[50%] flex-col'>
            <div className='flex flex-col mt-[48px] text-gray1'>
                <h1 className=' text-[16px]'>{"Choose how your name will be displayed"}</h1>
                <div className='flex justify-start items-center w-[45%]'>
                    <div className='flex mr-[16px]'>
                        <input type="radio" className='mr-[4px]' name='display'/>
                        <p className='text-[14px]'>{"Wallet address"}</p>
                    </div>
                    <div className='flex'>
                        <input type="radio" className='mr-[4px]' name='display'/>
                        <p className='text-[14px]'>{"ENS Name"}</p>
                    </div>
                </div>
            </div>
            <div className='text-gray1 mt-[24px]'>
                <h1 className='text-[16px]'>{"Where would you like to receive your notifications?"}</h1>
                <div className='flex mt-[8px]'>
                    <input type="radio" className='mr-[4px]' name='contact'/>
                    <div className='text-[14px]'>{"Telegram:"}</div>
                </div>
                <div className='flex items-center w-[300px]'>
                    <svg className='w-[15px]' width="12" height="15" viewBox="0 0 12 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5.81525 14.568C6.79925 14.568 7.72725 14.32 8.27925 14.032C8.47925 13.936 8.55125 13.832 8.55125 13.712C8.55125 13.592 8.48725 13.488 8.39125 13.304C8.24725 13.024 8.18325 12.912 8.04725 12.912C7.94325 12.912 7.83925 12.952 7.75125 13.008C7.28725 13.264 6.46325 13.392 5.81525 13.392C3.61525 13.392 1.51125 12.072 1.28725 9.224C1.23125 8.44 1.19925 7.112 1.27925 6.096C1.49525 3.48 3.39125 1.736 5.93525 1.736C8.52725 1.736 10.6633 3.424 10.6633 6.28V9.064C10.6633 9.64 10.3513 9.976 9.79125 9.976C9.23925 9.976 8.91925 9.64 8.91925 9.064V6.912C8.91925 5.216 7.73525 4.12 5.93525 4.12C4.16725 4.12 3.02325 5.264 3.02325 7.048V8.2C3.02325 9.944 4.13525 11.016 5.86325 11.016C6.24725 11.016 6.67125 10.968 7.05525 10.776C7.28725 10.664 7.38325 10.576 7.38325 10.456C7.38325 10.352 7.32725 10.232 7.23125 10.032C7.08725 9.76 7.04725 9.648 6.89525 9.648C6.81525 9.648 6.74325 9.672 6.64725 9.72C6.46325 9.792 6.12725 9.872 5.89525 9.872C4.84725 9.872 4.20725 9.264 4.20725 8.168V7.152C4.20725 5.976 4.84725 5.296 5.95125 5.296C7.07925 5.296 7.73525 5.92 7.73525 6.992V8.968C7.73525 10.192 8.50325 10.976 9.75125 10.976C11.0393 10.976 11.8233 10.184 11.8233 8.968V6.128C11.8233 2.768 9.15125 0.559999 5.93525 0.559999C2.78325 0.559999 0.31925 2.784 0.10325 5.952C0.04725 6.816 0.04725 8.48 0.11925 9.336C0.42325 12.888 3.10325 14.568 5.81525 14.568Z" fill="#AB224E"/>
                    </svg>
                    <input className='w-[285px] outline-none rounded-[4px] mr-[8px] text-[14px] bg-gumtint/[0.2] text-gum placeholder:text-gum/[0.5] p-2' placeholder='your username'/>
                </div>
                <div className='flex mt-[8px]'>
                    <input type="radio" className='mr-[4px]' name='contact'/>
                    <div className='text-[14px]'>{"Email:"}</div>
                </div>
                <div className='flex items-center w-[300px]'>
                    <input className='outline-none rounded-[4px] w-full mr-[8px] text-[14px] bg-gumtint/[0.2] text-gum placeholder:text-gum/[0.5] p-2' placeholder='Your Email Address'/>
                </div>

                <div className='flex mt-[4px]'>
                    <input type="radio" className='mr-[4px]' name='contact'/>
                    <div className='text-[14px]'>{"Choose later"}</div>
                </div>
            </div>
            <div className='text-gray1 mt-[24px]'>
                <h1 className='text-[16px]'>{"Set a profile picture"}</h1>
                <div className='flex mt-[8px] rounded-md justify-between items-center w-[300px] bg-gray6 p-3'>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7.57139 14.2854C11.2796 14.2854 14.2856 11.2794 14.2856 7.57119C14.2856 3.863 11.2796 0.856934 7.57139 0.856934C3.86321 0.856934 0.857143 3.863 0.857143 7.57119C0.857143 11.2794 3.86321 14.2854 7.57139 14.2854Z" fill="#EED3DC" stroke="#AB224E" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M15.1429 15.1432L12.3238 12.3242" stroke="#AB224E" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <input className='outline-none ml-[8px] rounded-[8px] w-full text-[14px] bg-gray6' placeholder='Type Doodles'/>
                </div>
            </div>
        </div>
        </div>
    </div>
  )
}

export default Onboarding
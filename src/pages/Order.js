import React from 'react'

const Order = ({sender, truncate}) => {
  return (
    <div className='trade flex-[4] mx-10'>
        <div className='trade-links flex w-2/5 justify-between text-white0'>
            <button>Create</button>
            <button>Pending</button>
            <button>Completed</button>
        </div>
        <div className="flex flex-col h-[70%] w-[80%] justify-evenly items-center">
            <div className='w-full bg-white10 h-[25%] flex flex-col justify-between p-2'>
                <p className='text-themepink'>{truncate(sender, 16)} (You)</p>
                <div className="add">
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="40" height="40" fill="white" fill-opacity="0.1"/>
                        <circle cx="20" cy="20" r="12" fill="white" fill-opacity="0.5"/>
                        <rect x="19.3999" y="14" width="1.2" height="12" fill="#2D2D2D"/>
                        <rect x="14" y="20.5996" width="1.2" height="12" transform="rotate(-90 14 20.5996)" fill="#2D2D2D"/>
                    </svg>
                </div>
            </div>
            <svg width="21" height="28" viewBox="0 0 21 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M11.8623 28L11.901 0.115574L14.362 0.111773L14.3318 21.9111L18.4728 18.0261L19.9735 20.3902L11.8623 28Z" fill="white"/>
                <path fillRule="evenodd" clipRule="evenodd" d="M5.67115 6.08913L1.53002 9.97455L0.0293032 7.6105L8.14098 -0.00028863L8.1007 27.8845L5.63966 27.8881L5.67115 6.08913Z" fill="white"/>
            </svg>
            <div className='w-full bg-white10 h-[25%] flex flex-col justify-between p-2'>
                <p className='text-themepink'>You</p>
                <div className="add">
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="40" height="40" fill="white" fill-opacity="0.1"/>
                        <circle cx="20" cy="20" r="12" fill="white" fill-opacity="0.5"/>
                        <rect x="19.3999" y="14" width="1.2" height="12" fill="#2D2D2D"/>
                        <rect x="14" y="20.5996" width="1.2" height="12" transform="rotate(-90 14 20.5996)" fill="#2D2D2D"/>
                    </svg>
                </div>
            </div>
            <button className='border-themepink border-2 border-solid w-1/2 bg-white10 rounded-sm text-themepink h-10 cursor-pointer'>Create Order</button>
        </div>
    </div>
  )
}

export default Order
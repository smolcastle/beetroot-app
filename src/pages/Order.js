import React, { useState } from 'react'
import NewTradeModal from '../components/NewTradeModal'
import seaport from '../utils/seaport'

const Order = ({sender, truncate, receiver}) => {
    const [openTrade, setOpenTrade] = useState(false)
    const [offerTrade, setOfferTrade] = useState(false)
    const [askTrade, setAskTrade] = useState(false)
    const [offers, setOffers] = useState([])
    const [considerations, setConsiderations] = useState([])

    async function createOrder() {
        // console.log(seaport.config);
        const orderActions = await seaport.seaport.createOrder({
            offer: offers,
            consideration: considerations,
            allowPartialFills: false,
            restrictedByZone: false,
        });
    }

  return (
    <>
    <div className='trade flex-[4] mx-10'>
        <div className='trade-links flex w-2/5 justify-between cursor:pointer text-white0'>
            <button>Create</button>
            <button>Pending</button>
            <button>Completed</button>
        </div>
        <div className="flex flex-col h-[75%] w-[90%] justify-evenly">
            <div className='w-full bg-white10 h-[25%] flex flex-col justify-between p-4 '>
                <p className='text-themepink text-sm text-[16px]'>{truncate(sender, 16)} {"(You)"}</p>
                <div className="flex justify-between w-[50%]">
                    <button onClick={() => {setOpenTrade(true); setOfferTrade(true); setAskTrade(false)}} className="w-[40px] h-[40px] bg-white10 flex items-center justify-center">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="12" r="12" fill="white" opacity='0.5'/>
                            <rect x="11.3999" y="6" width="1.2" height="12" fill="#565454"/>
                            <rect x="6" y="12.5996" width="1.2" height="12" transform="rotate(-90 6 12.5996)" fill="#565454"/>
                        </svg>
                    </button>
                    <button onClick={() => {setOpenTrade(true); setOfferTrade(true); setAskTrade(false)}} className="w-[40px] h-[40px] bg-white10"></button>
                    <button onClick={() => {setOpenTrade(true); setOfferTrade(true); setAskTrade(false)}} className="w-[40px] h-[40px] bg-white10"></button>
                    <button onClick={() => {setOpenTrade(true); setOfferTrade(true); setAskTrade(false)}} className="w-[40px] h-[40px] bg-white10"></button>
                    <button onClick={() => {setOpenTrade(true); setOfferTrade(true); setAskTrade(false)}} className="w-[40px] h-[40px] bg-white10"></button>
                </div>
            </div>
            <svg width="21" height="28" viewBox="0 0 21 28" className='self-center' fill="none" opacity='0.9' xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M11.8623 28L11.901 0.115574L14.362 0.111773L14.3318 21.9111L18.4728 18.0261L19.9735 20.3902L11.8623 28Z" fill="white"/>
                <path fillRule="evenodd" clipRule="evenodd" d="M5.67115 6.08913L1.53002 9.97455L0.0293032 7.6105L8.14098 -0.00028863L8.1007 27.8845L5.63966 27.8881L5.67115 6.08913Z" fill="white"/>
            </svg>
            <div className='w-full bg-white10 h-[25%] flex flex-col justify-between p-4'>
                <p className='text-themepink text-sm text-[16px]'>{truncate(receiver, 16)} {"(Them)"}</p>
                <div class="flex justify-between w-[50%]">
                    <button onClick={() => {setOpenTrade(true); setAskTrade(true); setOfferTrade(false)}} className='w-[40px] h-[40px] bg-white10 flex items-center justify-center'>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="12" r="12" fill="white" opacity='0.5'/>
                            <rect x="11.3999" y="6" width="1.2" height="12" fill="#565454"/>
                            <rect x="6" y="12.5996" width="1.2" height="12" transform="rotate(-90 6 12.5996)" fill="#565454"/>
                        </svg>
                    </button>
                    <button onClick={() => {setOpenTrade(true); setAskTrade(true); setOfferTrade(false)}} className='w-[40px] h-[40px] bg-white10'></button>
                    <button onClick={() => {setOpenTrade(true); setAskTrade(true); setOfferTrade(false)}} className='w-[40px] h-[40px] bg-white10'></button>
                    <button onClick={() => {setOpenTrade(true); setAskTrade(true); setOfferTrade(false)}} className='w-[40px] h-[40px] bg-white10'></button>
                    <button onClick={() => {setOpenTrade(true); setAskTrade(true); setOfferTrade(false)}} className='w-[40px] h-[40px] bg-white10'></button>
                </div>
            </div>
            <div class="flex w-full justify-between">
                <div className='flex flex-col w-[60%] text-[16px]'>
                    <input placeholder='set counterparty address (for private trade)' className='bg-white10 text-themepink placeholder:text-themepink outline-none p-2'></input>
                    <p className='text-white0 text-[11px] mt-3'>(leave empty for anyone to accept the swap)</p>
                </div>
                <div className='flex flex-col w-[35%] text-[16px]'>
                    <input placeholder='21/03/23' className='bg-white10 text-themepink placeholder:text-themepink outline-none p-2'></input>
                    <p className='text-white0 text-[11px] mt-3'>(leave empty for default expiry in 1 week)</p>
                </div>
            </div>
            <button className='w-full bg-pink80 rounded-sm text-pinktint10 h-10 font-inter cursor-pointer'
            onClick={
                async () => {
                    await createOrder()
                }
            }>{"Create Order"}
            </button>
            
        </div>
    </div>
    {openTrade && (
        <NewTradeModal considerations={considerations} setConsiderations={setConsiderations}
        offerTrade={offerTrade} setOfferTrade={setOfferTrade} setOpenTrade={setOpenTrade} sender={sender} receiver={receiver} setOffers={setOffers} offers={offers}/>
    )}
    </>
  )
}

export default Order
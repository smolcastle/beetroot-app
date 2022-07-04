import React, { useState, useEffect } from 'react'
import NewTradeModal from '../components/NewTradeModal'
import seaport from '../utils/seaport'
import { getDateTime } from '../helpers/Collections'
import { addDoc, getFirestore, collection, serverTimestamp, getDocs, doc, getDoc } from 'firebase/firestore'

const Order = ({sender, truncate, receiver}) => {
    const [openTrade, setOpenTrade] = useState(false)
    const [offerTrade, setOfferTrade] = useState(false)
    const [askTrade, setAskTrade] = useState(false)
    const [offers, setOffers] = useState([])
    const [considerations, setConsiderations] = useState([])
    const [showOption, setShowOption] = useState(1)
    const [orders, setOrders] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    // const setLoader = () =>{
    //     setIsLoading(true)
    // }

    async function saveOrder(order) {
        try {
          await addDoc(collection(getFirestore(), "orders"), {
            name: sender,
            to: receiver,
            order: order,
            timestamp: serverTimestamp(),
          });
        } catch (error) {
          console.error("Error writing new order to Firebase Database", error);
        }
      }
    async function createOrder() {
        // console.log(seaport.config);
        setIsLoading(true)
        const orderActions = await seaport.seaport.createOrder({
            offer: offers,
            consideration: considerations,
            allowPartialFills: false,
            restrictedByZone: false,
        });
        const order = await orderActions.executeAllActions();
        console.log(order)
        saveOrder(order)
        setIsLoading(false)
    }


    async function GetPendingOrders (){
        const data = await getDocs(collection(getFirestore(), 'orders'))
        setOrders(data.docs.map((doc) => ({...doc.data(), id: doc.id})))
    }
    useEffect(() => {
        GetPendingOrders()
    }, [])

    async function fulfillFunc(orderid){
        const docRef = doc(getFirestore(), 'orders', orderid)
        const data = await getDoc(docRef)
        const order = await data.get("order")
        console.log(order)
        const { executeAllActions: executeAllFulfillActions } = await seaport.seaport.fulfillOrder({
            order,
            accountAddress: sender,
          });

        const transaction = await executeAllFulfillActions()
        console.log(transaction)
    }


  return (
    <>
    <div className='trade flex-[4] mx-10'>
        <div className='trade-links flex w-2/5 justify-between cursor:pointer text-white0 mb-5'>
            <button onClick={() => setShowOption(1)} className={`${showOption == 1 ? "text-themepink" : ""}`}>Create</button>
            <button onClick={() => setShowOption(2)} className={`${showOption == 2 ? "text-themepink" : ""}`}>Pending</button>
            <button onClick={() => setShowOption(3)} className={`${showOption == 3 ? "text-themepink" : ""}`}>Completed</button>
        </div>
        {/*  */}
            {showOption == 1 && <>
                <div className="flex flex-col h-[85%] w-[95%] justify-evenly">
                    <div className="flex h-[80%] justify-evenly">
                        <div className='w-full bg-white10 h-full flex flex-col p-4 '>
                            <p className='text-themepink text-sm text-[16px] mb-[10px]'>{truncate(sender, 16)} {"(You)"}</p>
                            <div className="flex flex-col justify-evenly w-[50%] min-h-[60%]">
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
                        <svg className='self-center w-[100px]' width="24" height="18" viewBox="0 0 24 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M24 7.47266L1.09492 7.4409L1.0918 5.41933L18.9984 5.44416L15.8071 2.04263L17.7491 0.809924L24 7.47266Z" fill="white" fill-opacity="0.9"/>
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M6.00087 12.5584L9.19246 15.96L7.25057 17.1927L0.998844 10.5296L23.9042 10.5626L23.9072 12.5842L6.00087 12.5584Z" fill="white" fill-opacity="0.9"/>
                        </svg>
                        <div className='w-full bg-white10 h-full flex flex-col p-4'>
                            <p className='text-themepink text-sm text-[16px] mb-[10px]'>{truncate(receiver, 16)} {"(Them)"}</p>
                            <div class="flex flex-col justify-evenly w-[50%] min-h-[60%]">
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
                    </div>
                    <div class="flex w-[90%] justify-between">
                        <div className='flex flex-col mt-5 w-[52%] '>
                            <input placeholder='set counterparty address (for private trade)' className='bg-white10 text-themepink text-[14px] placeholder:text-themepink outline-none p-2'></input>
                            <p className='text-white0 text-[11px] mt-3'>(leave empty for anyone to accept the swap)</p>
                        </div>
                        <div className='flex flex-col mt-5 w-[40%]'>
                            <input placeholder='21/03/23' className='bg-white10 text-themepink placeholder:text-themepink outline-none text-[14px] p-2'></input>
                            <p className='text-white0 text-[11px] mt-3'>(leave empty for default expiry in 1 week)</p>
                        </div>
                    </div>
                    {!isLoading && <button className='w-full bg-pink80 rounded-sm text-pinktint10 h-10 font-inter mt-5 cursor-pointer'
                    onClick={
                        async () => {
                            await createOrder()
                        }
                    }>{"Create Order"}
                    </button>}
                    {isLoading &&
                    <button className='w-full bg-pink80 text-pinktint10 h-10 cursor-pointer flex justify-center items-center'>
                        <svg className='w-[10%]' version="1.1" id="L9" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                        viewBox="0 0 100 100" enable-background="new 0 0 0 0" xmlSpace="preserve">
                          <path fill="#fff" d="M73,50c0-12.7-10.3-23-23-23S27,37.3,27,50 M30.9,50c0-10.5,8.5-19.1,19.1-19.1S69.1,39.5,69.1,50">
                            <animateTransform
                               attributeName="transform"
                               attributeType="XML"
                               type="rotate"
                               dur="1s"
                               from="0 50 50"
                               to="360 50 50"
                               repeatCount="indefinite" />
                        </path>
                      </svg>
                      </button>
                    }
                </div>
            </>}
        {showOption == 2 && <>
            <div>
                {orders.map((order) => {
                    if((order.name == sender || order.name == receiver) && (order.to == receiver || order.to == sender)){
                    return (
                        <div className='flex justify-around bg-white10 rounded-lg p-3 mb-4'>
                            <div>
                                <h1 className='text-white0'>You: {truncate(order.to, 16)}</h1>
                                <h1 className='my-2 text-white0'>Created: {getDateTime(order.timestamp?.seconds)}</h1>
                                {(order.to == sender) && <button className='bg-green1 rounded-sm p-2 text-white0' onClick={() => fulfillFunc(order.id)}>Fulfill</button>}
                            </div>
                            <svg className='self-center w-[100px]' width="24" height="18" viewBox="0 0 24 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M24 7.47266L1.09492 7.4409L1.0918 5.41933L18.9984 5.44416L15.8071 2.04263L17.7491 0.809924L24 7.47266Z" fill="white" fill-opacity="0.9"/>
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M6.00087 12.5584L9.19246 15.96L7.25057 17.1927L0.998844 10.5296L23.9042 10.5626L23.9072 12.5842L6.00087 12.5584Z" fill="white" fill-opacity="0.9"/>
                            </svg>
                            <div>                                
                                <h1 className='text-white0'>Them: {truncate(order.name, 16)}</h1>
                                <h1 className='my-2 text-white0'>Expires in: 1 week</h1>
                                {(order.to == sender) && <button className='bg-red rounded-sm p-2 text-white0'>Reject</button>}
                            </div>
                        </div>
                    )}
                })}
            </div>
        </>}
    </div>
    {openTrade && (
        <NewTradeModal considerations={considerations} setConsiderations={setConsiderations}
        offerTrade={offerTrade} setOfferTrade={setOfferTrade} setOpenTrade={setOpenTrade} sender={sender} receiver={receiver} setOffers={setOffers} offers={offers}/>
    )}
    </>
  )
}
export default Order
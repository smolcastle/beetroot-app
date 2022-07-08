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
        if(offers.length == 0 || considerations.length == 0){
            alert("Order cannot be empty")
        }
        else{
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
    <div className='trade flex-[4] mx-10 my-5'>
        <div className='trade-links flex w-4/6 justify-between cursor:pointer text-parsley mb-5'>
            <button onClick={() => setShowOption(4)} className={`bg-parsleytint px-3 rounded-md ${showOption == 4 ? "border border-parsley border-solid" : ""}`}>Wallet</button>
            <button onClick={() => setShowOption(1)} className={`bg-parsleytint px-3 rounded-md ${showOption == 1 ? "border border-parsley border-solid" : ""}`}>Trade</button>
            <button onClick={() => setShowOption(3)} className={`bg-parsleytint px-3 rounded-md ${showOption == 3 ? "border border-parsley border-solid" : ""}`}>Order History</button>
            <button onClick={() => setShowOption(2)} className={`bg-parsleytint px-3 rounded-md ${showOption == 2 ? "border border-parsley border-solid" : ""}`}>Pending Orders</button>
        </div>
        {/*  */}
            {showOption == 1 && <>
                <div className="flex flex-col h-[90%] w-[95%] justify-evenly">
                    <div className="flex h-full w-full">
                    <div className='flex flex-col justify-evenly w-[50%] h-full'>
                        <h1 className='text-[24px] text-gum'>Trade NFTS</h1>
                        <p className='text-[14px]'>Using this feature you can create an order to trade NFTs and currency with any of your existing contacts. Do this by adding NFTs in each of the 2 carts below and then clicking ‘create order’.</p>
                        <h3 className='text-[18px]'>Your Wallet</h3>
                        <h3 className='text-[18px]'>Their Wallet</h3>
                        <p className='text-[14px]'>Paste in the field below the public address of a person you would like to trade with. You can leave this field blank if you would like this request be open to the public.</p>
                        <h3 className='text-[18px]'>Expiry Date</h3>
                        <p className='text-[14px]'>Leave this field blank if you would like the order request to remain active for eternity.</p>
                        {!isLoading && <button className='w-full border-2 border-gum border-solid rounded-3xl text-gum h-10 font-bold mt-5 cursor-pointer'
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
                    <div className='w-[50%] h-full'></div>
                    </div>
                    {/* <div className="flex h-[80%] justify-evenly">
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
                    </div>*/}

                </div>
            </>}
        {showOption == 2 && <>
            <div>
                {orders.map((order) => {
                    if((order.name == sender || order.name == receiver) && (order.to == receiver || order.to == sender)){
                    return (
                        <div className='flex justify-around bg-gray6 rounded-lg p-3 mb-4'>
                            <div>
                                {(order.to == sender) && <h1 className='text-gray2'>You: {truncate(order.to, 10)}</h1>}
                                {(order.to != sender) && <h1 className='text-gray2'>You: {truncate(order.name, 10)}</h1>}
                                <h1 className='my-2 text-gray2 text-[14px]'>Created: {getDateTime(order.timestamp?.seconds)}</h1>
                                {(order.to == sender) && <button className='bg-parsleytint rounded-sm px-2 text-parsley rounded-md mr-3' onClick={() => fulfillFunc(order.id)}>Fulfill</button>}
                                {(order.to == sender) && <button className='bg-gumtint rounded-sm px-2 text-gum rounded-md '>Reject</button>}
                            </div>
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9.06627 7.98361L15.8797 7.98356M12.7444 11.6194C14.1223 10.3124 14.8109 9.51555 15.8851 7.98369C14.8109 6.45175 14.1224 5.65485 12.7444 4.3479" stroke="#4F4F4F" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M4.11304 12.0168L10.9345 12.0168M7.25637 8.38105C5.8784 9.68797 5.18987 10.4849 4.11564 12.0168C5.18987 13.5487 5.87842 14.3456 7.25636 15.6526" stroke="#4F4F4F" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            <div>
                                {(order.to == sender) && <h1 className='text-gray2'>Them: {truncate(order.name, 10)}</h1>}
                                {(order.to != sender) && <h1 className='text-gray2'>Them: {truncate(order.to, 10)}</h1>}
                                <h1 className='my-2 text-gray2 text-[14px]'>Expires in: 1 week</h1>
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

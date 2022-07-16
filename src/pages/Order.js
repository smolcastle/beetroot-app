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
    const [showPendingOrder, setShowPendingOrder] = useState(null)
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

    const showPendingOrderFunc = (id, index) => {
        orders.map(order => {
            if (order.id === id){
                setShowPendingOrder(index)
            }
        })
    }
    const hidePendingOrderFunc = (id, index) => {
        orders.map(order => {
            if (order.id === id){
                setShowPendingOrder(null)
            }
        })
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
                <div className="flex flex-col h-[95%] w-[95%] justify-evenly">
                    <div className="flex h-full w-full">
                    <div className='flex flex-col justify-evenly w-[50%] h-full'>
                        <h1 className='text-[24px] text-gum font-questa'>Trade NFTS</h1>
                        <p className='text-[16px]'>Using this feature you can create an order to trade NFTs and currency with any of your existing contacts. Do this by adding NFTs in each of the 2 carts below and then clicking ‘create order’.</p>
                        <h3 className='text-[18px]'>Your Wallet</h3>
                        <div className='flex bg-parsleytint text-parsley p-2 rounded-md border border-parsley border-solid justify-between'>
                        <p>{truncate(sender, 10)} (You)</p>
                        <button className='bg-parsleytint text-[15px]'>Clear cart</button>
                        </div>
                        <h3 className='text-[18px]'>Their Wallet</h3>
                        <p className='text-[14px]'>Paste in the field below the public address of a person you would like to trade with. You can leave this field blank if you would like this request be open to the public.</p>
                        <div className='bg-parsleytint rounded-md p-2 flex justify-between text-parsley'>
                        <input placeholder='Their Wallet Address' className='outline-none bg-parsleytint placeholder-parsley'></input>
                        <button className='bg-parsleytint text-[15px]'>Clear cart</button>
                        </div>
                        <h3 className='text-[18px]'>Expiry Date</h3>
                        <p className='text-[14px]'>Leave this field blank if you would like the order request to remain active for eternity.</p>
                        <div className='flex justify-evenly  items-center text-[15px]'>
                            <input placeholder='00 MINS' className=' w-[80px] outline-none bg-parsleytint rounded-md p-2 placeholder-parsley text-parsley'></input>
                            <p>+</p>
                            <input placeholder='00.00 HRS' className='w-[100px] outline-none bg-parsleytint rounded-md p-2 placeholder-parsley text-parsley'></input>
                            <p>+</p>
                            <input placeholder='000 DAYS' className='w-[90px] outline-none bg-parsleytint rounded-md p-2 placeholder-parsley text-parsley'></input>
                        </div>
                        {!isLoading && <button className='w-full border-2 border-gum border-solid rounded-3xl text-gum h-10 font-bold mt-5 cursor-pointer'
                            onClick={
                                async () => {
                                    await createOrder()
                                }
                            }>{"CREATE ORDER"}
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
                    <div className='w-[50%] h-full ml-5'>
                        <div className='bg-parsleytint flex rounded-md items-center px-2 py-1'>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7.5714 14.2859C11.2796 14.2859 14.2856 11.2798 14.2856 7.57167C14.2856 3.86349 11.2796 0.857422 7.5714 0.857422C3.86322 0.857422 0.857147 3.86349 0.857147 7.57167C0.857147 11.2798 3.86322 14.2859 7.5714 14.2859Z" fill="#DCE5D7" stroke="#4E7B36" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M15.1429 15.1432L12.3238 12.3242" stroke="#4E7B36" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <input placeholder='Search to add NFTS into your cart' className='w-full outline-none bg-parsleytint p-2 placeholder-parsley text-parsley'></input>
                        </div>
                        <div className='flex rounded-md items-center my-3 justify-between'>
                            <div className='flex rounded-md text-parsley w-[90%] bg-parsleytint items-center px-2 py-1 justify-between'>
                            <input placeholder='Add Tokens (Ex: ETH)' className='w-[70%] outline-none bg-parsleytint p-2 placeholder-parsley text-parsley'></input>
                            <input placeholder='Amount' className='w-[30%] outline-none bg-parsleytint p-2 placeholder-parsley text-parsley'></input>
                            </div>
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1.097 11.7358C1.27315 13.3823 2.59738 14.7065 4.24304 14.8899C6.7708 15.1717 9.22919 15.1717 11.7569 14.8899C13.4026 14.7065 14.7269 13.3823 14.903 11.7358C15.033 10.5203 15.1429 9.2725 15.1429 8.00031C15.1429 6.72814 15.033 5.4803 14.903 4.26486C14.7269 2.61841 13.4026 1.29417 11.7569 1.11073C9.22919 0.828975 6.7708 0.828975 4.24304 1.11073C2.59738 1.29417 1.27315 2.61841 1.097 4.26486C0.966956 5.4803 0.857147 6.72814 0.857147 8.00031C0.857147 9.2725 0.966957 10.5203 1.097 11.7358Z" fill="#DCE5D7" stroke="#4E7B36"/>
                                <path d="M8 5.14258V10.8569" stroke="#4E7B36" stroke-linecap="round"/>
                                <path d="M10.8571 8H5.14285" stroke="#4E7B36" stroke-linecap="round"/>
                            </svg>
                        </div>
                    </div>
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
            <div className='w-[80%]'>
                <p className='text-gray1 mb-2'>Show only orders pertaining to user selected in the chat box</p>
                {orders.map((order, index) => {
                    if((order.name == sender || order.name == receiver) && (order.to == receiver || order.to == sender)){
                        console.log(index)
                    return (
                        <div className='flex flex-col bg-gray6 rounded-lg p-3 mb-4'>
                        <div className='flex justify-between '>
                            <div className='w-[30%] flex flex-col'>
                                <div className="flex items-center">
                                    {(order.to == sender) && <h1 className='text-gray2'>You: {truncate(order.to, 10)}</h1>}
                                    {(order.to != sender) && <h1 className='text-gray2'>You: {truncate(order.name, 10)}</h1>}
                                    <svg className='ml-2' width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M0.884288 9.03111C0.986211 9.85208 1.64944 10.5006 2.47224 10.5866C3.61078 10.7056 4.79078 10.8313 6 10.8313C7.20922 10.8313 8.38922 10.7056 9.52774 10.5866C10.3505 10.5006 11.0138 9.85208 11.1157 9.03111C11.2374 8.0509 11.3571 7.03723 11.3571 5.99963C11.3571 4.96203 11.2374 3.94836 11.1157 2.96818C11.0138 2.14721 10.3505 1.49866 9.52774 1.41265C8.38922 1.29363 7.20922 1.16797 6 1.16797C4.79078 1.16797 3.61077 1.29363 2.47224 1.41265C1.64944 1.49866 0.986211 2.14721 0.884279 2.96818C0.762591 3.94836 0.642857 4.96203 0.642857 5.99963C0.642857 7.03723 0.762591 8.0509 0.884288 9.03111Z" fill="#EED3DC" stroke="#AB224E"/>
                                        <path d="M0.908203 2.74707L4.9389 5.92489C5.56108 6.41571 6.43892 6.41571 7.06141 5.92489L11.0918 2.74707" stroke="#AB224E" stroke-linejoin="round"/>
                                    </svg>
                                </div>
                                {/* <h1 className='my-2 text-gray2 text-[14px]'>Created: {getDateTime(order.timestamp?.seconds)}</h1> */}
                                {(order.to == sender) && <button className='bg-parsleytint rounded-sm px-2 text-parsley rounded-md mr-3' onClick={() => fulfillFunc(order.id)}>Fulfill</button>}
                                {(order.to == sender) && <button className='bg-gumtint rounded-sm px-2 text-gum rounded-md '>Reject</button>}
                            </div>
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9.06627 7.98361L15.8797 7.98356M12.7444 11.6194C14.1223 10.3124 14.8109 9.51555 15.8851 7.98369C14.8109 6.45175 14.1224 5.65485 12.7444 4.3479" stroke="#4F4F4F" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M4.11304 12.0168L10.9345 12.0168M7.25637 8.38105C5.8784 9.68797 5.18987 10.4849 4.11564 12.0168C5.18987 13.5487 5.87842 14.3456 7.25636 15.6526" stroke="#4F4F4F" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            <div>
                                <div className="flex items-center justify-between">
                                    {(order.to == sender) && <h1 className='text-gray2'>Them: {truncate(order.name, 10)}</h1>}
                                    {(order.to != sender) && <h1 className='text-gray2'>Them: {truncate(order.to, 10)}</h1>}
                                    <svg className='ml-2' width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M0.884288 9.03111C0.986211 9.85208 1.64944 10.5006 2.47224 10.5866C3.61078 10.7056 4.79078 10.8313 6 10.8313C7.20922 10.8313 8.38922 10.7056 9.52774 10.5866C10.3505 10.5006 11.0138 9.85208 11.1157 9.03111C11.2374 8.0509 11.3571 7.03723 11.3571 5.99963C11.3571 4.96203 11.2374 3.94836 11.1157 2.96818C11.0138 2.14721 10.3505 1.49866 9.52774 1.41265C8.38922 1.29363 7.20922 1.16797 6 1.16797C4.79078 1.16797 3.61077 1.29363 2.47224 1.41265C1.64944 1.49866 0.986211 2.14721 0.884279 2.96818C0.762591 3.94836 0.642857 4.96203 0.642857 5.99963C0.642857 7.03723 0.762591 8.0509 0.884288 9.03111Z" fill="#EED3DC" stroke="#AB224E"/>
                                        <path d="M0.908203 2.74707L4.9389 5.92489C5.56108 6.41571 6.43892 6.41571 7.06141 5.92489L11.0918 2.74707" stroke="#AB224E" stroke-linejoin="round"/>
                                    </svg>
                                </div>
                                <h1 className='my-2 text-gray2 text-[14px]'>Expires in: 1 week</h1>
                            </div>
                            {showPendingOrder !== index &&
                            <svg onClick={() => showPendingOrderFunc(order.id, index)} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8 11.2174L8 4.7832" stroke="#4F4F4F" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M10.6914 7.09307C9.87362 6.05981 9.31661 5.57897 8.48653 4.95009C8.19282 4.72757 7.80749 4.72757 7.51377 4.95009C6.68369 5.57897 6.12668 6.05981 5.3089 7.09308" stroke="#4F4F4F" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>}
                            {showPendingOrder === index &&
                            <svg onClick={() => hidePendingOrderFunc(order.id, index)} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8 4.78265L8 11.2168" stroke="#4F4F4F" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M5.30866 8.90693C6.12644 9.94019 6.68345 10.421 7.51353 11.0499C7.80724 11.2724 8.19257 11.2724 8.48629 11.0499C9.31637 10.421 9.87338 9.94019 10.6912 8.90692" stroke="#4F4F4F" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>}
                        </div>
                            <div index={index} className={`${showPendingOrder === index ? "block" : "hidden"}`}>
                                Order Info
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

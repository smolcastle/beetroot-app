import React, { useState, useEffect } from 'react'
import NewTradeModal from '../components/NewTradeModal'
import seaport from '../utils/seaport'
import { getDateTime } from '../helpers/Collections'
import { addDoc, getFirestore, collection, serverTimestamp, getDocs, doc, getDoc } from 'firebase/firestore'
import TradeTab from '../components/TradeTab'

const Order = ({sender, truncate, receiver}) => {
    const [openTrade, setOpenTrade] = useState(false)
    const [offerTrade, setOfferTrade] = useState(true)
    const [askTrade, setAskTrade] = useState(false)
    const [offers, setOffers] = useState([])
    const [considerations, setConsiderations] = useState([])
    const [showOption, setShowOption] = useState(1)
    const [orders, setOrders] = useState([])
    const [showPendingOrder, setShowPendingOrder] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    async function saveOrder(order, offerFor) {
        try {
          await addDoc(collection(getFirestore(), "orders"), {
            name: sender,
            to: offerFor,
            order: order,
            timestamp: serverTimestamp(),
          });
        } catch (error) {
          console.error("Error writing new order to Firebase Database", error);
        }
      }
    async function createOrder(offerFor) {
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
            saveOrder(order, offerFor)
            setIsLoading(false)
        }
        setIsLoading(false)
        setOffers([])
        setConsiderations([])
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
            {showOption == 1 &&
                <TradeTab considerations={considerations} setConsiderations={setConsiderations} truncate={truncate} isLoading={isLoading} createOrder={createOrder} askTrade={askTrade} setAskTrade={setAskTrade}
                offerTrade={offerTrade} setOfferTrade={setOfferTrade} setOpenTrade={setOpenTrade} sender={sender} receiver={receiver} setOffers={setOffers} offers={offers}/>
            }
        {showOption == 2 && <>
            <div className='w-[80%]'>
                <p className='text-gray1 mb-2'>Show only orders pertaining to user selected in the chat box</p>
                {orders.map((order, index) => {
                    if((order.name == sender || order.name == receiver) && (order.to == receiver || order.to == sender)){
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
    </>
  )
}
export default Order

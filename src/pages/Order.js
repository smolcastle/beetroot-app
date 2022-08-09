import React, { useState, useEffect } from 'react'
import seaport from '../utils/seaport'
import { getDateTime } from '../helpers/Collections'
import { addDoc, getFirestore, collection, serverTimestamp, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore'
import TradeTab from '../components/TradeTab'
import WalletTab from '../components/WalletTab'

const Order = ({sender, truncate, receiver}) => {
    const [openTrade, setOpenTrade] = useState(false)
    const [offerTrade, setOfferTrade] = useState(true)
    const [askTrade, setAskTrade] = useState(false)
    const [offers, setOffers] = useState([])
    const [considerations, setConsiderations] = useState([])
    const [showOption, setShowOption] = useState(2)
    const [orders, setOrders] = useState([])
    const [showPendingOrder, setShowPendingOrder] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    async function saveOrder(order, offerFor) {
        try {
          await addDoc(collection(getFirestore(), "orders"), {
            name: sender,
            to: offerFor,
            order: order,
            status: 'pending',
            timestamp: serverTimestamp(),
          });
        } catch (error) {
          console.error("Error writing new order to Firebase Database", error);
        }
      }
    async function createOrder(offerFor) {
        try{
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
        } catch(e){
            // hide loader when cancel is clicked on metamask notification
            console.log("Error creating an order",e)
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
        if(data.exists()){
            await updateDoc(docRef, {
                status: 'fulfilled',
            })
        }
        // update order list as soon as it is fulfilled
        GetPendingOrders()
    }

    async function cancelFunc(orderid){
        const orderRef = doc(getFirestore(), 'orders', orderid)
        const orderSnap = await getDoc(orderRef)
        if(orderSnap.exists()){
        await updateDoc(orderRef, {
                status: 'cancelled',
            })
        }
        // update order list as soon as it is cancelled
        GetPendingOrders()
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
        <div className='trade-links flex w-2/5 text-[12px] justify-between cursor:pointer text-parsley mb-5'>
            <button onClick={() => setShowOption(1)} className={`bg-parsleytint px-[12px] py-[6px] rounded-md ${showOption == 1 ? "border border-parsley border-solid" : ""}`}>Wallet</button>
            <button onClick={() => setShowOption(2)} className={`bg-parsleytint px-3 rounded-md ${showOption == 2 ? "border border-parsley border-solid" : ""}`}>Trade</button>
            <button onClick={() => setShowOption(3)} className={`bg-parsleytint px-3 rounded-md ${showOption == 3 ? "border border-parsley border-solid" : ""}`}>History</button>
        </div>
        {showOption === 1 &&
            <WalletTab receiver={receiver} truncate={truncate} />
        }
        {showOption === 2 &&
            <TradeTab considerations={considerations} setConsiderations={setConsiderations} truncate={truncate} isLoading={isLoading} createOrder={createOrder} askTrade={askTrade} setAskTrade={setAskTrade}
            offerTrade={offerTrade} setOfferTrade={setOfferTrade} setOpenTrade={setOpenTrade} sender={sender} receiver={receiver} setOffers={setOffers} offers={offers}/>
        }
        {showOption === 3 && <>
            <div className='w-[70%]'>
                {orders.map((order, index) => {
                    if((order.name == sender || order.name == receiver) && (order.to == receiver || order.to == sender)){
                    return (
                        <div className='flex flex-col bg-gray6 rounded-lg p-3 mb-4 w-[100%]'>
                            <div className='flex justify-between'>
                                <div className='w-[60%]'>
                                    <h1 className='my-2 text-gray2 text-[10px]'>Created: {getDateTime(order.timestamp?.seconds).date}</h1>
                                    {order.status === 'pending' && <h1 className='text-gray2 text-[10px]'>Order has not been fulfilled by recipient. Waiting...</h1>}
                                    {order.status === 'cancelled' && <h1 className='text-gum text-[10px]'>Order Cancelled</h1>}
                                    {order.status === 'fulfilled' && <h1 className='text-parsley text-[10px]'>Order Complete</h1>}
                                </div>
                                <div className='w-[35%] mt-[4px]'>
                                    {(order.to == sender && order.status !== 'cancelled') && <button className='bg-parsleytint text-[12px] py-1 px-4 text-parsley rounded-[4px] mr-3' onClick={() => fulfillFunc(order.id)}>Fulfill</button>}
                                    {(order.status !== 'cancelled') && <button className='bg-gumtint py-1 px-4 text-[12px] text-gum rounded-[4px]' onClick={() => cancelFunc(order.id)}>Reject</button>}
                                </div>
                                <div className='w-[5%]'>
                                {showPendingOrder !== index &&
                                    <svg className='cursor-pointer' onClick={() => showPendingOrderFunc(order.id, index)} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M8 4.78265L8 11.2168" stroke="#4F4F4F" stroke-linecap="round" stroke-linejoin="round"/>
                                        <path d="M5.30866 8.90693C6.12644 9.94019 6.68345 10.421 7.51353 11.0499C7.80724 11.2724 8.19257 11.2724 8.48629 11.0499C9.31637 10.421 9.87338 9.94019 10.6912 8.90692" stroke="#4F4F4F" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                }
                                {showPendingOrder === index &&
                                    <svg className='cursor-pointer' onClick={() => hidePendingOrderFunc(order.id, index)} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M8 11.2174L8 4.7832" stroke="#4F4F4F" stroke-linecap="round" stroke-linejoin="round"/>
                                        <path d="M10.6914 7.09307C9.87362 6.05981 9.31661 5.57897 8.48653 4.95009C8.19282 4.72757 7.80749 4.72757 7.51377 4.95009C6.68369 5.57897 6.12668 6.05981 5.3089 7.09308" stroke="#4F4F4F" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                }
                                </div>
                            </div>
                            <div className='flex justify-between mt-3'>
                                <div className='w-[50%]'>
                                    {(order.to == sender) && <h1 className='text-gray2 text-[12px]'>{truncate(order.to, 14)}</h1>}
                                    {(order.to != sender) && <h1 className='text-gray2 text-[12px]'>{truncate(order.name, 14)}</h1>}
                                </div>
                                <div className='flex items-center w-[45%]'>
                                    <svg className='mr-2' width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M9.06627 7.98361L15.8797 7.98356M12.7444 11.6194C14.1223 10.3124 14.8109 9.51555 15.8851 7.98369C14.8109 6.45175 14.1224 5.65485 12.7444 4.3479" stroke="#4F4F4F" stroke-linecap="round" stroke-linejoin="round"/>
                                            <path d="M4.11304 12.0168L10.9345 12.0168M7.25637 8.38105C5.8784 9.68797 5.18987 10.4849 4.11564 12.0168C5.18987 13.5487 5.87842 14.3456 7.25636 15.6526" stroke="#4F4F4F" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                    {(order.to == sender) && <h1 className='text-gray2 text-[12px]'>{truncate(order.name, 14)}</h1>}
                                    {(order.to != sender) && <h1 className='text-gray2 text-[12px]'>{truncate(order.to, 14)}</h1>}
                                </div>
                            </div>
                            <div className=''>
                                <div index={index} className={`${showPendingOrder === index ? "block" : "hidden"}`}>
                                    Order Info
                                </div>
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

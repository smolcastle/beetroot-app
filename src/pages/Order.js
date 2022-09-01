import React, { useState, useEffect } from 'react';
import seaport from '../utils/seaport';
import { getDateTime } from '../helpers/Collections';
import {
  addDoc,
  getFirestore,
  collection,
  serverTimestamp,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  query,
  onSnapshot,
  orderBy
} from 'firebase/firestore';
import TradeTab from '../components/TradeTab';
import WalletTab from '../components/WalletTab';
import { showPopUp } from '../actions/actions';
import { useDispatch } from 'react-redux';

const Order = ({ sender, truncate, receiver }) => {
  const [openTrade, setOpenTrade] = useState(false);
  const [offerTrade, setOfferTrade] = useState(true);
  const [askTrade, setAskTrade] = useState(false);
  const storedOffers = JSON.parse(localStorage.getItem('offers')); // get the offers stored in local storage
  const [offers, setOffers] = useState(storedOffers || []); // if any offers exist in local storage save them to this array else start with an empty array
  const storedConsiderations = JSON.parse(
    localStorage.getItem('considerations')
  );
  const [considerations, setConsiderations] = useState(
    storedConsiderations || []
  );
  const [showOption, setShowOption] = useState(2);
  const [orders, setOrders] = useState([]);
  const [showPendingOrder, setShowPendingOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [orderCreated, setOrderCreated] = useState(false);

  const dispatch = useDispatch();

  async function saveOrder(order, offerFor, expiryDate) {
    try {
      await addDoc(collection(getFirestore(), 'orders'), {
        name: sender,
        to: offerFor,
        cartOffers: offers,
        cartConsiderations: considerations,
        order: order,
        status: 'pending',
        expiryDate: expiryDate,
        // check if user has given any expiry date if not set status to 0
        expired: expiryDate > 0 ? (expiryDate > today ? false : true) : 0,
        timestamp: serverTimestamp()
      });
    } catch (error) {
      console.error('Error writing new order to Firebase Database', error);
    }
  }
  async function createOrder(offerFor, expiryDate) {
    try {
      if (offers.length == 0 || considerations.length == 0) {
        dispatch(showPopUp('alert', 'Order cannot be empty'));
      } else {
        setIsLoading(true);
        const orderActions = await seaport.seaport.createOrder({
          offer: offers,
          consideration: considerations,
          allowPartialFills: false,
          restrictedByZone: false
        });
        const order = await orderActions.executeAllActions();
        console.log(order);
        saveOrder(order, offerFor, expiryDate);
        setOrderCreated(true);
        setIsLoading(false);
      }
    } catch (e) {
      // hide loader when cancel is clicked on metamask notification
      console.log('Error creating an order', e);
      dispatch(showPopUp('alert', 'Error creating the order'));
      setIsLoading(false);
    }
    setIsLoading(false);
  }

  // cancel an order using seaport function
  async function cancelOrder(orderid) {
    try {
      const docRef = doc(getFirestore(), 'orders', orderid);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        console.log("order doesn't exist");
      }

      const order = await docSnap.get('order');
      console.log(order);
      await seaport.seaport
        .cancelOrders([order.parameters], order.offerer)
        .transact();

      // update the status of order in db after cancelling
      await updateDoc(orderRef, {
        status: 'cancelled'
      });

      // update order list as soon as it is cancelled
      GetPendingOrders();
    } catch (e) {
      console.log('error cancelling the order', e);
    }
  }

  async function GetPendingOrders() {
    // use onSnapshot to fetch orders
    try {
      const ordersRef = collection(getFirestore(), 'orders');
      const q = query(ordersRef, orderBy('timestamp', 'desc'));
      onSnapshot(q, (querySnapshot) => {
        let orders = [];
        querySnapshot.forEach((doc) => {
          orders.push({ ...doc.data(), id: doc.id });
        });
        setOrders(orders);
      });
    } catch (e) {
      console.log(e);
    }
  }
  useEffect(() => {
    GetPendingOrders();
  }, []);

  async function fulfillFunc(orderid) {
    const docRef = doc(getFirestore(), 'orders', orderid);
    const data = await getDoc(docRef);
    const order = await data.get('order');
    console.log(order);
    const { executeAllActions: executeAllFulfillActions } =
      await seaport.seaport.fulfillOrder({
        order,
        accountAddress: sender
      });

    const transaction = await executeAllFulfillActions();
    console.log(transaction);
    if (data.exists()) {
      await updateDoc(docRef, {
        status: 'fulfilled'
      });
    }
    // update order list as soon as it is fulfilled
    GetPendingOrders();
  }

  const showPendingOrderFunc = (id, index) => {
    orders.map((order) => {
      if (order.id === id) {
        setShowPendingOrder(index);
      }
    });
  };
  const hidePendingOrderFunc = (id, index) => {
    orders.map((order) => {
      if (order.id === id) {
        setShowPendingOrder(null);
      }
    });
  };

  const dateObj = new Date();
  const currDate = dateObj.getDate();
  const currMonth = dateObj.getMonth();
  const currYear = dateObj.getFullYear();
  const currHour = dateObj.getHours();
  const currMinute = dateObj.getMinutes();

  const d2 = new Date(currYear, currMonth, currDate, currHour, currMinute);
  const today = d2.getTime();

  function OrderExpiry({ orderId, orderExpiryDate, expireStatus }) {
    // check if present date is past the expiry date if yes update the status in db
    if (orderExpiryDate !== 0 && orderExpiryDate < today) {
      const docRef = doc(getFirestore(), 'orders', orderId);
      updateDoc(docRef, {
        expired: true
      });
    }
    if (orderExpiryDate > today) {
      // calculate the no. of days between the expiry date and present date
      const date = Math.floor(
        (orderExpiryDate - today) / (1000 * 60 * 60 * 24)
      );
      const hours = Math.ceil((orderExpiryDate - today) / (1000 * 60 * 60));
      return (
        <>
          {date === 0 ? (
            // if the date is 0 day it means value is less than 24 hours. so show expiry date in hours format
            <h1>Order expires in about {hours} hours.</h1>
          ) : (
            <h1>Order expires in about {date} day/s.</h1>
          )}
        </>
      );
    }
    if (expireStatus === true) {
      return (
        <>
          <h1>Order expired.</h1>
        </>
      );
    }
  }

  const [hover, setHover] = useState(false);
  const onHover = () => {
    setHover(true);
  };

  const onLeave = () => {
    setHover(false);
  };

  return (
    <>
      <div className="trade flex-[4] my-5">
        <div className="trade-links flex w-2/5 text-[12px] justify-between cursor:pointer text-parsley">
          <button
            onClick={() => setShowOption(1)}
            className={`bg-parsleytint px-[12px] py-[6px] rounded-md w-[30%] ${
              showOption == 1 ? 'border border-parsley border-solid' : ''
            }`}
          >
            Wallet
          </button>
          <button
            onClick={() => setShowOption(2)}
            className={`bg-parsleytint px-3 rounded-md w-[30%] ${
              showOption == 2 ? 'border border-parsley border-solid' : ''
            }`}
          >
            Trade
          </button>
          <button
            onClick={() => setShowOption(3)}
            className={`bg-parsleytint px-3 rounded-md w-[30%] ${
              showOption == 3 ? 'border border-parsley border-solid' : ''
            }`}
          >
            History
          </button>
        </div>
        {showOption === 1 && (
          <WalletTab receiver={receiver} truncate={truncate} />
        )}
        {showOption === 2 && (
          <TradeTab
            considerations={considerations}
            setConsiderations={setConsiderations}
            truncate={truncate}
            isLoading={isLoading}
            createOrder={createOrder}
            askTrade={askTrade}
            setAskTrade={setAskTrade}
            offerTrade={offerTrade}
            setOfferTrade={setOfferTrade}
            setOpenTrade={setOpenTrade}
            sender={sender}
            receiver={receiver}
            setOffers={setOffers}
            offers={offers}
            orderCreated={orderCreated}
            setOrderCreated={setOrderCreated}
          />
        )}
        {showOption === 3 && (
          <>
            <div className="w-[70%] max-h-[600px] overflow-y-scroll px-2 mt-4">
              {orders.map((order, index) => {
                if (
                  (order.name == sender || order.name == receiver) &&
                  (order.to == receiver ||
                    order.to == sender ||
                    order.to === '')
                ) {
                  return (
                    <div
                      className="flex flex-col bg-gray6 rounded-lg p-3 mb-4 w-[100%]"
                      key={index}
                    >
                      <div className="flex justify-between">
                        <div className="w-[60%]">
                          <h1 className="my-2 text-gray2 text-[10px]">
                            Created:{' '}
                            {getDateTime(order.timestamp?.seconds).date}
                          </h1>
                          {!order.expired && (
                            <>
                              {order.status === 'pending' &&
                                order.name === sender && (
                                  <h1 className="text-gray2 text-[10px]">
                                    Order has not been fulfilled by recipient.
                                    Waiting...
                                  </h1>
                                )}
                              {order.status === 'pending' &&
                                order.to === sender && (
                                  <h1 className="text-gray2 text-[10px]">
                                    Click on the fulfill button to accept the
                                    order.
                                  </h1>
                                )}
                              {order.status === 'cancelled' && (
                                <h1 className="text-gum text-[10px]">
                                  Order Cancelled
                                </h1>
                              )}
                              {order.status === 'fulfilled' && (
                                <h1 className="text-parsley text-[10px]">
                                  Order Complete
                                </h1>
                              )}
                            </>
                          )}
                          {(order.status !== 'cancelled' ||
                            order.status === 'fulfilled') && (
                            <div className="text-gum text-[10px] mt-1">
                              <OrderExpiry
                                orderId={order.id}
                                orderExpiryDate={order.expiryDate}
                                expireStatus={order.expired}
                              />
                            </div>
                          )}
                        </div>
                        <div className="w-[35%] mt-[4px]">
                          {!order.expired && (
                            <>
                              {order.name !== sender &&
                                order.status !== 'cancelled' &&
                                order.status !== 'fulfilled' && (
                                  <button
                                    className="bg-parsleytint text-[12px] py-1 px-4 text-parsley rounded-[4px] mr-3"
                                    onClick={() => fulfillFunc(order.id)}
                                  >
                                    Fulfill
                                  </button>
                                )}
                              {order.name === sender &&
                                order.status !== 'cancelled' &&
                                order.status !== 'fulfilled' && (
                                  <button
                                    className="bg-gumtint py-1 px-4 text-[12px] text-gum rounded-[4px]"
                                    onClick={() => cancelOrder(order)}
                                  >
                                    Reject
                                  </button>
                                )}
                            </>
                          )}
                        </div>
                        <div className="w-[5%]">
                          {showPendingOrder !== index && (
                            <svg
                              className="cursor-pointer"
                              onClick={() =>
                                showPendingOrderFunc(order.id, index)
                              }
                              width="16"
                              height="16"
                              viewBox="0 0 16 16"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M8 4.78265L8 11.2168"
                                stroke="#4F4F4F"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M5.30866 8.90693C6.12644 9.94019 6.68345 10.421 7.51353 11.0499C7.80724 11.2724 8.19257 11.2724 8.48629 11.0499C9.31637 10.421 9.87338 9.94019 10.6912 8.90692"
                                stroke="#4F4F4F"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          )}
                          {showPendingOrder === index && (
                            <svg
                              className="cursor-pointer"
                              onClick={() =>
                                hidePendingOrderFunc(order.id, index)
                              }
                              width="16"
                              height="16"
                              viewBox="0 0 16 16"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M8 11.2174L8 4.7832"
                                stroke="#4F4F4F"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M10.6914 7.09307C9.87362 6.05981 9.31661 5.57897 8.48653 4.95009C8.19282 4.72757 7.80749 4.72757 7.51377 4.95009C6.68369 5.57897 6.12668 6.05981 5.3089 7.09308"
                                stroke="#4F4F4F"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          )}
                        </div>
                      </div>
                      <div className="flex justify-between mt-3">
                        <div className="w-[50%]">
                          <h1 className="text-gray2 text-[12px]">
                            {truncate(order.name, 14)}
                          </h1>
                        </div>
                        <div className="flex items-center w-[45%]">
                          <svg
                            className="mr-2"
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M9.06627 7.98361L15.8797 7.98356M12.7444 11.6194C14.1223 10.3124 14.8109 9.51555 15.8851 7.98369C14.8109 6.45175 14.1224 5.65485 12.7444 4.3479"
                              stroke="#4F4F4F"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M4.11304 12.0168L10.9345 12.0168M7.25637 8.38105C5.8784 9.68797 5.18987 10.4849 4.11564 12.0168C5.18987 13.5487 5.87842 14.3456 7.25636 15.6526"
                              stroke="#4F4F4F"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <h1 className="text-gray2 text-[12px]">
                            {truncate(order.to, 14)}
                          </h1>
                        </div>
                      </div>
                      <div className="">
                        <div
                          index={index}
                          className={`flex justify-between mt-8 ${
                            showPendingOrder === index ? 'block' : 'hidden'
                          }`}
                        >
                          <div className="w-[50%] h-[auto]">
                            {order.cartOffers.map((offer) => {
                              return (
                                <div key={offer.id}>
                                  <div className="flex text-[12px] text-gum justify-between items-center mb-4 px-2">
                                    <div className="flex items-center justify-center w-full">
                                      {offer.symbol && (
                                        <div className="flex flex-col w-full">
                                          <div>
                                            {offer.name === 'Ethereum' && (
                                              <p>Ethereum</p>
                                            )}
                                            {offer.name ===
                                              'Wrapped Ethereum' && (
                                              <p>Wrapped Ethereum</p>
                                            )}
                                          </div>
                                          <div className="flex justify-between mt-1">
                                            {offer.symbol === 'ETH' && (
                                              <p>ETH</p>
                                            )}
                                            {offer.symbol === 'WETH' && (
                                              <p>WETH</p>
                                            )}
                                            <p>{offer.enteredAmount}</p>
                                          </div>
                                        </div>
                                      )}
                                      {offer.identifier && (
                                        <div className="w-full flex">
                                          <div>
                                            {offer.identifier && (
                                              <img
                                                className="w-[40px] h-[40px] rounded-[8px] mr-4"
                                                src={offer.image_url}
                                              />
                                            )}
                                          </div>
                                          <div className="flex flex-col">
                                            {offer.identifier && (
                                              <p>{offer.name}</p>
                                            )}
                                            {offer.token && (
                                              <div className="relative">
                                                <p
                                                  className="text-[10px] text-gum"
                                                  onMouseEnter={onHover}
                                                  onMouseLeave={onLeave}
                                                >
                                                  {truncate(offer.token, 14)}
                                                </p>
                                                {hover && (
                                                  <p className="text-[8px] px-2 py-[5px] rounded-[4px] text-white0 bg-gray2 absolute">
                                                    {offer.token}
                                                  </p>
                                                )}
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                          <div className="w-[40%] h-[auto]">
                            {order.cartConsiderations.map((consideration) => {
                              return (
                                <div key={consideration.id}>
                                  <div className="flex text-[12px] text-gum justify-between items-center mb-4 px-2">
                                    <div className="flex items-center justify-center w-full">
                                      <div className="flex flex-col w-full">
                                        <div>
                                          {consideration.name ===
                                            'Ethereum' && <p>Ethereum</p>}
                                          {consideration.name ===
                                            'Wrapped Ethereum' && (
                                            <p>Wrapped Ethereum</p>
                                          )}
                                        </div>
                                        <div className="flex justify-between mt-1">
                                          {consideration.symbol === 'ETH' && (
                                            <p>ETH</p>
                                          )}

                                          {consideration.symbol === 'WETH' && (
                                            <p className="mt-2">WETH</p>
                                          )}
                                          <p>{consideration.enteredAmount}</p>
                                        </div>
                                      </div>

                                      <div className="flex items-center justify-evenly">
                                        {consideration.identifier && (
                                          <img
                                            className="w-[40px] h-[40px] rounded-[8px] mr-4"
                                            src={consideration.image_url}
                                          />
                                        )}
                                      </div>
                                      <div className="flex flex-col">
                                        {consideration.identifier && (
                                          <p>{consideration.name}</p>
                                        )}
                                        {consideration.token && (
                                          <div className="relative">
                                            <p
                                              className="text-[10px] text-gum"
                                              onMouseEnter={onHover}
                                              onMouseLeave={onLeave}
                                            >
                                              {truncate(
                                                consideration.token,
                                                14
                                              )}
                                            </p>
                                            {hover && (
                                              <p className="text-[8px] px-2 py-[5px] rounded-[4px] text-white0 bg-gray2 absolute">
                                                {consideration.token}
                                              </p>
                                            )}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }
              })}
            </div>
          </>
        )}
      </div>
    </>
  );
};
export default Order;

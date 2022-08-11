import React from 'react'

const ReviewOrder = ({offers, considerations, removeItem, setReviewOrder, createOrder, offerFor, isLoading, orderCreated, setOffers, setConsiderations}) => {

  function Cart(){
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3.42871 3.07129H4.09467C5.42695 3.07129 6.5824 3.99207 6.87974 5.29075L7.6521 8.66396" stroke="#4E7B36" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M20.8603 9.8557C20.6627 11.9446 20.0703 13.683 19.573 14.7571C19.3174 15.3091 18.8686 15.7377 18.2804 15.8927C17.5606 16.0824 16.3222 16.2859 14.321 16.2859C12.3198 16.2859 11.0815 16.0824 10.3617 15.8927C9.77347 15.7377 9.32454 15.3091 9.069 14.7571C8.46228 13.4465 7.71387 11.1472 7.71387 8.42871H19.4996C20.2886 8.42871 20.9346 9.07023 20.8603 9.8557Z" fill="#DCE5D7" stroke="#4E7B36" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M9.85756 21.2464C10.7405 21.2464 11.4563 20.5305 11.4563 19.6475C11.4563 18.7645 10.7405 18.0488 9.85756 18.0488C8.97459 18.0488 8.25879 18.7645 8.25879 19.6475C8.25879 20.5305 8.97459 21.2464 9.85756 21.2464Z" fill="#DCE5D7" stroke="#4E7B36" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M18.7852 21.2464C19.6682 21.2464 20.384 20.5305 20.384 19.6475C20.384 18.7645 19.6682 18.0488 18.7852 18.0488C17.9022 18.0488 17.1865 18.7645 17.1865 19.6475C17.1865 20.5305 17.9022 21.2464 18.7852 21.2464Z" fill="#DCE5D7" stroke="#4E7B36" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    )
  };

  return (
    <>
      <div className="w-screen h-screen justify-center items-center flex overflow-x-hidden bg-white overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className='flex flex-col bg-white0 py-4 px-8 w-[50%] h-[80%] rounded-[8px] shadow-xl'>
            <button className='place-self-end cursor-pointer' onClick={() => {
                if(orderCreated){
                    // if the order is created successfully empty the cart
                    setReviewOrder(false);
                    setOffers([]);
                    setConsiderations([]);
                } else {
                    setReviewOrder(false);
                }
            }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.5254 7.47461L7.47461 12.5254" stroke="#AB224E" stroke-linecap="round"/>
                    <path d="M12.5254 12.5254L7.47461 7.47461" stroke="#AB224E" stroke-linecap="round"/>
                </svg>
            </button>
            <h1 className='text-gum font-bold'>Review Your Order:</h1>
            <div className='flex justify-between mt-4'>
                <div className='flex w-[40%] justify-between items-center'>
                    <h1 className='text-[12px] font-normal text-gray1'>My Cart</h1>
                    <Cart />
                </div>
                <div className='flex w-[40%] justify-between items-center'>
                    <h1 className='text-[12px] font-normal text-gray1'>Their Cart</h1>
                    <Cart />
                </div>
            </div>
            <div className='flex justify-between mt-8'>
                <div className='w-[40%] max-h-[450px] h-[450px] overflow-y-scroll'>
                {offers?.map((offer) => {
                    return (
                        <>
                        <div className='flex text-[12px] text-gum justify-between items-center mb-4 px-2'>
                            <div className='flex items-center justify-center'>
                                <div className='flex flex-col'>
                                    {offer.name === 'Ethereum' && <p>Ethereum</p>}
                                    {offer.symbol === 'ETH' && <p className='mt-2'>ETH</p>}
                                </div>
                                <div className='flex items-center justify-between'>
                                    {offer.identifier && <img className='w-[40px] h-[40px] rounded-[8px] mr-4' src={offer.image_url}/>}
                                </div>
                                <div>
                                    {offer.identifier && <p>{offer.name}</p>}
                                    <p className='text-[8px] text-gum'>{offer.token}</p>
                                </div>
                            </div>
                            <div className='flex flex-col justify-center'>
                            <svg className='place-self-end cursor-pointer' onClick={() => removeItem(offer.id)} width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M0.642578 3.20996H11.3569" stroke="#AB224E" stroke-linecap="round"/>
                                <path d="M9.84896 3.20996H2.14698C2.02265 5.45785 2.02459 7.6884 2.35966 9.92218C2.48336 10.7468 3.19178 11.3569 4.02568 11.3569H7.97025C8.80419 11.3569 9.51253 10.7468 9.6363 9.92218C9.97136 7.6884 9.97325 5.45785 9.84896 3.20996Z" fill="#EED3DC" stroke="#AB224E" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M3.8584 3.2099V2.78202C3.8584 2.2146 4.0838 1.67043 4.48503 1.2692C4.88625 0.867981 5.43042 0.642578 5.99784 0.642578C6.56525 0.642578 7.10942 0.867981 7.51064 1.2692C7.91186 1.67043 8.13727 2.2146 8.13727 2.78202V3.2099" stroke="#AB224E" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M4.71484 5.50195V9.04869" stroke="#AB224E" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M7.28223 5.50195V9.04869" stroke="#AB224E" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            <p className='mt-4'>{offer.enteredAmount}</p>
                            </div>
                        </div>
                        </>
                    )
                })}
                </div>
                <div className='w-[40%] max-h-[450px] h-[450px] overflow-y-scroll'>
                {considerations?.map((consideration) => {
                    return (
                        <>
                        <div className='flex text-[12px] text-gum justify-between items-center mb-4 px-2'>
                            <div className='flex items-center justify-center'>
                                <div className='flex flex-col'>
                                    {consideration.name === 'Ethereum' && <p>Ethereum</p>}
                                    {consideration.symbol === 'ETH' && <p className='mt-2'>ETH</p>}
                                </div>
                                <div className='flex items-center justify-between'>
                                    {consideration.identifier && <img className='w-[40px] h-[40px] rounded-[8px] mr-4' src={consideration.image_url}/>}
                                </div>
                                <div>
                                    {consideration.identifier && <p>{consideration.name}</p>}
                                    <p className='text-[8px] text-gum'>{consideration.token}</p>
                                </div>
                            </div>
                            <div className='flex flex-col justify-center'>
                            <svg className='place-self-end cursor-pointer' onClick={() => removeItem(consideration.id)} width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M0.642578 3.20996H11.3569" stroke="#AB224E" stroke-linecap="round"/>
                                <path d="M9.84896 3.20996H2.14698C2.02265 5.45785 2.02459 7.6884 2.35966 9.92218C2.48336 10.7468 3.19178 11.3569 4.02568 11.3569H7.97025C8.80419 11.3569 9.51253 10.7468 9.6363 9.92218C9.97136 7.6884 9.97325 5.45785 9.84896 3.20996Z" fill="#EED3DC" stroke="#AB224E" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M3.8584 3.2099V2.78202C3.8584 2.2146 4.0838 1.67043 4.48503 1.2692C4.88625 0.867981 5.43042 0.642578 5.99784 0.642578C6.56525 0.642578 7.10942 0.867981 7.51064 1.2692C7.91186 1.67043 8.13727 2.2146 8.13727 2.78202V3.2099" stroke="#AB224E" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M4.71484 5.50195V9.04869" stroke="#AB224E" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M7.28223 5.50195V9.04869" stroke="#AB224E" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            <p className='mt-4'>{consideration.enteredAmount}</p>
                            </div>
                        </div>
                        </>
                    )
                })}
                </div>
            </div>
            {!isLoading && !orderCreated && <button className='w-full border-[1px] border-gum border-solid rounded-[4px] text-[14px] text-gum h-10 mt-5 cursor-pointer'
                onClick={ async () => { await createOrder(offerFor);}}>
                     {"LOOKS GOOD"}
            </button>}
            {isLoading &&
                <button className='w-full bg-gumtint text-gum h-10 rounded-3xl mt-5 cursor-pointer flex justify-center items-center'>
                    <svg className='w-[5%]' version="1.1" id="L9" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                    viewBox="0 0 100 100" enable-background="new 0 0 0 0" xmlSpace="preserve">
                        <path fill="#AB224E" d="M73,50c0-12.7-10.3-23-23-23S27,37.3,27,50 M30.9,50c0-10.5,8.5-19.1,19.1-19.1S69.1,39.5,69.1,50">
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
            {orderCreated && <button className='w-full border-[1px] border-gum border-solid rounded-[4px] text-[14px] text-gum h-10 mt-5'>
                     {"YOUR ORDER HAS BEEN CREATED!"}
            </button>}
            <p className='text-[10px] mt-4 text-gray1'>When you click the above button, this order request will be sent to the given recipient. Once they fulfil your request, this transcation will begin to be processed. </p>
        </div>
      </div>
      <div className="opacity-50 fixed inset-0 z-40 bg-white0"></div>
    </>
  )
}

export default ReviewOrder;
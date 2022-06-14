import React, {useState} from 'react'
import ScrollToBottom from 'react-scroll-to-bottom'
import logo2 from '../img/logo2.png' 

function NavBtn({ title }) {
    return (
      <button
        type="button"
        className="py-2 text-white0 text-[12px] w-20 h-10 md:text-[12px] md:w-24 lg:w-40 mr-4 font-termina eye_cursor"
      >
        {title}
      </button>
    );
}
function ChatBtn({ title }) {
    return (
      <button
        type="button"
        className="py-2 border-themepink border-2 border-solid text-themepink text-[12px] w-20 h-10 md:text-[12px] md:w-24 lg:w-40 mr-4 font-termina eye_cursor"
      >
        {title}
      </button>
    );
}

const Chats = ({WalletButton}) => {
  const [counter, setCounter] = useState(0);
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  const handleNew = () => {
    setCounter(counter + 1);
  };

  var date = new Date()
  var[day, month, year] = [date.getDate(), date.toLocaleString('default', { month: 'long' }), date.getFullYear()]

  const sendMessage = () =>{
    if (currentMessage !== "") {
        const messageData = {
          message: currentMessage,
          date:   
              month +
              " " +
              day +
              ", " +
              year
    };
    setMessageList((list) => [...list, messageData]);
    setCurrentMessage("");
  }
}

const dates =[];
const pushDate = (messageDate) => {
    dates.push(messageDate)
}

  return (
    <div className='bg-globaltheme w-screen h-screen overflow-y-hidden'>
        <div className="flex items-center h-40 w-full z-10">
          <div className="flex justify-start items-center w-full md:w-52 ml-5 sm:ml-10 sm:justify-start lg:justify-center relative">
            <img
                className="w-10 h-10 xs:w-12 xs:h-12 lg:w-16 lg:h-16 object-contain"
                src={logo2}
                alt=""
            />
          </div>
          <div className= "md:flex flex-1 justify-end items-center md:pr-5 lg:pr-8 xl:pr-12" >
            <svg width="24" height="24" viewBox="0 0 24 24" className='mr-4' fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.9999 21.6012C13.4579 21.6012 14.6399 20.3119 14.6399 18.7215C14.6399 17.1311 13.4579 15.8418 11.9999 15.8418C10.5418 15.8418 9.35986 17.1311 9.35986 18.7215C9.35986 20.3119 10.5418 21.6012 11.9999 21.6012Z" fill="white"/>
                <path d="M10.2577 4.59101L10.2401 4.32223C10.2398 4.0586 10.2893 3.79773 10.3856 3.55589C10.4818 3.31405 10.6226 3.09642 10.7993 2.91656C10.9761 2.7367 11.1848 2.59847 11.4127 2.51047C11.6405 2.42248 11.8825 2.38662 12.1236 2.40512C12.3647 2.42363 12.5997 2.49609 12.814 2.61801C13.0283 2.73993 13.2173 2.90869 13.3691 3.11376C13.521 3.31884 13.6326 3.55584 13.6968 3.80999C13.761 4.06415 13.7766 4.33001 13.7425 4.59101C15.0187 5.00154 16.1388 5.85181 16.9351 7.01459C17.7314 8.17736 18.1612 9.59014 18.1601 11.0415V15.841C18.1601 16.0956 18.2528 16.3398 18.4178 16.5198C18.5829 16.6998 18.8067 16.8009 19.0401 16.8009C19.2735 16.8009 19.4973 16.9021 19.6623 17.0821C19.8274 17.2621 19.9201 17.5063 19.9201 17.7608C19.9201 18.0154 19.8274 18.2596 19.6623 18.4396C19.4973 18.6196 19.2735 18.7207 19.0401 18.7207H4.96008C4.72669 18.7207 4.50286 18.6196 4.33782 18.4396C4.17279 18.2596 4.08008 18.0154 4.08008 17.7608C4.08008 17.5063 4.17279 17.2621 4.33782 17.0821C4.50286 16.9021 4.72669 16.8009 4.96008 16.8009C5.19347 16.8009 5.4173 16.6998 5.58233 16.5198C5.74736 16.3398 5.84008 16.0956 5.84008 15.841V11.0415C5.83896 9.59014 6.26871 8.17736 7.06503 7.01459C7.86135 5.85181 8.98143 5.00154 10.2577 4.59101V4.59101Z" fill="white"/>
            </svg>
            <ChatBtn title={"CHATS"} />
            <NavBtn title={"ORDER HISTORY"} />
            <NavBtn title={"PORTFOLIO"} />
            <NavBtn title={"PROFIT/LOSS"} />
            <WalletButton />
          </div>
        </div>
        <div className="w-screen h-4/5 flex justify-evenly mt-10">
            <div className='w-2/12 h-5/6 bg-white10 p-10' id='users'>
                <button className='border-themepink border-2 border-solid w-full bg-white10 text-themepink h-10 rounded-sm cursor-pointer' onClick={handleNew}>New</button>
                {Array.from(Array(counter)).map((c, index) => {
                    return <input key={c} className='w-full p-2 h-10 mt-2 text-white0 bg-white10 focus:outline-none'></input>;
            })}
            </div>

            <div className='chat-container w-4/12 h-5/6 bg-white10'>
                <div className='chat-name h-10 bg-white10'></div>
                <div className='chat-window text-white0 h-4/5 px-2'>
                <ScrollToBottom className="message-container h-full ">
                {messageList.map((messageContent) => {
                            return (
                                <>
                                <div className='flex flex-col items-end mt-2 text-[12px] h-auto'>
                                    <div className="message-content min-w-min max-w-xs bg-white10 p-1 break-words">
                                        <p>{messageContent.message}</p>
                                    </div>
                                {/* {dates.includes(messageContent.date) ? null : <p className='chat-date text-[12px]'>{messageContent.date}</p>}
                                {pushDate(messageContent.date)} */}
                                </div>
                                </>
                            );
                        },
                        )}
                </ScrollToBottom>
                </div>
                <div className='chat-input h-14 px-3 mt-5 flex justify-evenly'>
                    <input className='w-4/5 p-3 h-12 bg-white10 text-white0 rounded-sm focus:outline-none' 
                        value={currentMessage} 
                        onChange={(event) => {
                            setCurrentMessage(event.target.value);
                        }}
                        onKeyPress={(event) => {
                            event.key === "Enter" && sendMessage();
                    }}></input>
                    <button className='h-12' onClick={sendMessage}>
                        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="36" height="36" rx="18" fill="#D9D9D9" fillOpacity="0.1"/>
                        <g opacity="0.8">
                        <path d="M29.2972 17.4755L11.1682 8.44869C10.9864 8.36279 10.764 8.38423 10.6023 8.5346C10.4406 8.66368 10.3597 8.87851 10.4203 9.09348L11.7744 14.66C11.8755 15.0468 12.1382 15.3478 12.502 15.4552L19.0301 17.5616C19.4141 17.6905 19.4141 18.2708 19.0301 18.3998L12.4818 20.506C12.1181 20.6135 11.8553 20.9144 11.7542 21.3012L10.4203 26.8892C10.3597 27.1042 10.4404 27.3406 10.6021 27.4695C10.7032 27.5554 10.8245 27.5984 10.9457 27.5984C11.0265 27.5984 11.1074 27.577 11.168 27.534L29.297 18.5072C29.4789 18.4213 29.6001 18.2063 29.6001 17.9913C29.6003 17.7763 29.479 17.5615 29.2972 17.4755L29.2972 17.4755Z" fill="#9B9B9B"/>
                        </g>
                        </svg>
                    </button>
                </div>
            </div>

            <div className='trade w-4/12 h-4/6'>
                <div className='trade-links flex w-2/5 justify-between text-white0'>
                    <button>Create</button>
                    <button>Pending</button>
                    <button>Completed</button>
                </div>
                <div className="flex flex-col h-full justify-evenly items-center">
                    <div className='w-full bg-white10 h-1/3'></div>
                    <svg width="21" height="28" viewBox="0 0 21 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M11.8623 28L11.901 0.115574L14.362 0.111773L14.3318 21.9111L18.4728 18.0261L19.9735 20.3902L11.8623 28Z" fill="white"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M5.67115 6.08913L1.53002 9.97455L0.0293032 7.6105L8.14098 -0.00028863L8.1007 27.8845L5.63966 27.8881L5.67115 6.08913Z" fill="white"/>
                    </svg>
                    <div className='w-full bg-white10 h-1/3'></div>
                    <button className='border-themepink border-2 border-solid w-1/2 bg-white10 rounded-sm text-themepink h-10 cursor-pointer'>Create Order</button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Chats
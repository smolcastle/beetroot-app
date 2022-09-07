import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { hidePopUp } from '../actions/actions';
import '../animation.css';

export function PopUpBox() {
  const dispatch = useDispatch();

  const popUp = useSelector((state) => state.popUp.showPopUp);
  const category = useSelector((state) => state.popUp.category);
  const msgTitle = useSelector((state) => state.popUp.msgTitle);
  if (!popUp) {
    return <></>;
  }

  return (
    <div
      className={`w-[300px] h-[50px] overflow-x-hidden scale-in-center p-2 px-3 flex justify-between items-center font-rubrik rounded-[4px] shadow-lg absolute right-12 bottom-12 z-50 ${
        category === 'alert' ? 'bg-gumtint' : 'bg-parsleytint'
      }
      `}
    >
      <h1 className="text-[14px] text-gray1 ">{msgTitle}</h1>
      <button
        onClick={() => {
          dispatch(hidePopUp());
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`${
            category === 'alert' ? 'stroke-gum' : 'stroke-parsley'
          }`}
        >
          <path d="M12.5254 7.47461L7.47461 12.5254" strokeLinecap="round" />
          <path d="M12.5254 12.5254L7.47461 7.47461" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}

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
      className={`w-[300px] h-[100px] overflow-x-hidden bounce-in-top justify-evenly items-center font-rubrik flex flex-col rounded-[8px] shadow-lg absolute right-12 bottom-12 z-50 ${
        category === 'alert' ? 'bg-gumtint' : 'bg-parsleytint'
      } `}
    >
      <h1 className="text-[16px] text-gray1">{msgTitle}</h1>
      <button
        className={` text-[14px]  px-3 ${
          category === 'alert'
            ? 'border-gum border-solid border-[1px] text-gum'
            : 'border-parsley border-solid border-[1px] text-parsley'
        }`}
        onClick={() => {
          dispatch(hidePopUp());
        }}
      >
        Ok
      </button>
    </div>
  );
}

import React from 'react';
import { useSelector } from 'react-redux';

export default function LoaderOverlay() {
  const loading = useSelector((state) => state.loader.showLoader);
  if (!loading) {
    return <></>;
  }
  return (
    <>
      <div className="w-screen h-screen justify-center items-center flex overflow-x-hidden bg-white shadow-lg overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <span className="loader"></span>
      </div>
      <div className=" fixed inset-0 z-40 bg-white0"></div>
    </>
  );
}

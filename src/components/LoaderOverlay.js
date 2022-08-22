import React from 'react';
import { LoopCircleLoading } from 'react-loadingg';
import { useSelector } from 'react-redux';

export default function LoaderOverlay() {
  const loading = useSelector((state) => state.loader.showLoader);
  if (!loading) {
    return <></>;
  }
  return (
    <>
      <div className="w-screen h-screen justify-center items-center flex overflow-x-hidden bg-white shadow-lg overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <LoopCircleLoading size={'large'} color={'#AB224E'} />
      </div>
      <div className=" fixed inset-0 z-40 bg-white0"></div>
    </>
  );
}

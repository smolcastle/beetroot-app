import React, { useEffect, useState } from 'react';
import profile from '../img/profile.png';
import { toEns } from '../utils/ens';

const Profile = ({ truncate, sender, displayName }) => {
  const [ensName, setEnsName] = useState('');
  async function getEnsName() {
    let ens = await toEns(sender);
    setEnsName(ens);
  }
  useEffect(() => {
    getEnsName();
  });
  return (
    <>
      <div className="flex flex-col w-[50%] bg-gumtint/[0.2] rounded-l-[16px] h-full items-center justify-evenly">
        <img src={profile} className="w-[48px]"></img>
        <div className="flex flex-col items-center">
          {displayName === 'ens name' && ensName ? (
            <p>{ensName}</p>
          ) : (
            <p>{truncate(sender, 14)}</p>
          )}
          <p className="text-gray3 mt-[4px] text-[12px]">Unverified</p>
        </div>
        <div className="flex w-[50%] mt-[-16px] items-center justify-evenly">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1.17903 12.0418C1.31492 13.1364 2.19923 14.0011 3.29629 14.1159C4.81435 14.2745 6.38768 14.442 7.99997 14.442C9.61227 14.442 11.1856 14.2745 12.7036 14.1159C13.8007 14.0011 14.685 13.1364 14.8209 12.0418C14.9832 10.7349 15.1428 9.3833 15.1428 7.99983C15.1428 6.61636 14.9832 5.26481 14.8209 3.9579C14.685 2.86327 13.8007 1.99854 12.7036 1.88386C11.1856 1.72517 9.61227 1.55762 7.99997 1.55762C6.38768 1.55762 4.81434 1.72517 3.29629 1.88386C2.19923 1.99854 1.31492 2.86327 1.17901 3.9579C1.01676 5.26481 0.857117 6.61636 0.857117 7.99983C0.857117 9.3833 1.01676 10.7349 1.17903 12.0418Z"
              fill="#EED3DC"
              stroke="#AB224E"
            />
            <path
              d="M1.21094 3.66211L6.58479 7.89921C7.41478 8.55363 8.58522 8.55363 9.41521 7.89921L14.789 3.66211"
              stroke="#AB224E"
              strokeLinejoin="round"
            />
          </svg>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8 14C4.6863 14 2 11.3138 2 8C2 4.6863 4.6863 2 8 2C11.3138 2 14 4.6863 14 8C14 11.3138 11.3138 14 8 14Z"
              fill="#EED3DC"
              stroke="#AB224E"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12.2402 12.2403L3.76019 3.76025"
              stroke="#AB224E"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0.857117 4.28027H15.1428"
              stroke="#AB224E"
              strokeLinecap="round"
            />
            <path
              d="M13.1323 4.28027H2.86295C2.69718 7.27746 2.69976 10.2515 3.14651 13.2299C3.31145 14.3294 4.25601 15.1429 5.36787 15.1429H10.6273C11.7392 15.1429 12.6837 14.3294 12.8487 13.2299C13.2955 10.2515 13.298 7.27746 13.1323 4.28027Z"
              fill="#EED3DC"
              stroke="#AB224E"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M5.14496 4.28003V3.70952C5.14496 2.95296 5.4455 2.2274 5.98047 1.69243C6.51543 1.15747 7.24099 0.856934 7.99754 0.856934C8.75409 0.856934 9.47966 1.15747 10.0146 1.69243C10.5496 2.2274 10.8501 2.95296 10.8501 3.70952V4.28003"
              stroke="#AB224E"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M6.28601 7.33545V12.0644"
              stroke="#AB224E"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M9.70911 7.33545V12.0644"
              stroke="#AB224E"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
      <div className="flex w-[50%] rounded-r-[16px] justify-end items-end p-[16px]">
        <svg
          width="48"
          height="48"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M37.957 37.957C47.9394 27.9746 47.9394 11.7899 37.957 1.80748L1.80748 37.957C11.7899 47.9394 27.9746 47.9394 37.957 37.957Z"
            fill="#EED3DC"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M19.6815 20.083C19.7924 20.1939 19.9722 20.1939 20.0831 20.083C20.194 19.9721 20.194 19.7923 20.0831 19.6814L23.6981 16.0664C25.8055 18.1738 25.8055 21.5906 23.6981 23.698C21.5907 25.8054 18.1739 25.8054 16.0665 23.698L19.6815 20.083Z"
            fill="#AB224E"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M15.6645 24.1C17.9937 26.4292 21.7702 26.4292 24.0994 24.1C26.4286 21.7708 26.4286 17.9943 24.0994 15.6651L27.7144 12.0501C32.0401 16.3759 32.0401 23.3892 27.7144 27.7149C23.3886 32.0407 16.3753 32.0407 12.0496 27.7149L15.6645 24.1Z"
            fill="#AB224E"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M11.648 28.1165C16.1955 32.6641 23.5686 32.6641 28.1161 28.1165C32.6637 23.569 32.6637 16.1959 28.1161 11.6484L31.7311 8.03343C38.2751 14.5775 38.2751 25.1874 31.7311 31.7315C25.187 38.2755 14.5771 38.2755 8.03304 31.7315L11.648 28.1165Z"
            fill="#AB224E"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M7.63147 32.133C14.3973 38.8989 25.367 38.8989 32.1328 32.133C38.8987 25.3672 38.8987 14.3975 32.1328 7.63167L35.7478 4.01672C44.5101 12.7791 44.5101 26.9856 35.7478 35.748C26.9854 44.5103 12.7789 44.5103 4.01652 35.748L7.63147 32.133Z"
            fill="#AB224E"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M3.61495 36.1496C12.5991 45.1337 27.1654 45.1337 36.1496 36.1496C45.1337 27.1654 45.1337 12.5991 36.1496 3.61495L39.7645 0C50.7452 10.9807 50.7452 28.7838 39.7645 39.7645C28.7838 50.7452 10.9807 50.7452 0 39.7645L3.61495 36.1496Z"
            fill="#AB224E"
          />
        </svg>
      </div>
    </>
  );
};

export default Profile;

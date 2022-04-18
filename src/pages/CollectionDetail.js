import React, { useState } from "react";
import { useLocation } from "react-router-dom";

const testData = [
  "https://lh3.googleusercontent.com/aJeB3DFRf8oxX4XPiTULe7y0ZVb_njSI2iaZTmMkI7RVFJpeLw6QBLEm5VdMIczr3EXpJYChbM-GEPNq4dSLjkw5MEZPaMvhUGR5OA=s0",
  "https://lh3.googleusercontent.com/_3F3VyE01AHDOX3Zzity_Sw7BxjrO1j-kwO0_8deZWc4ZJn3c4JEMJ9g26-4RHCBYzayRnakEvLGbvWnYwL8pwOytNfm118nm0poyQ=s0",
  "https://lh3.googleusercontent.com/5C-jEO3zoQL7y663URfke3-Kh_DuuB00Uz7NCksa5THizfo4k2KkITECka6N0lBYA5reP-rPVs82iVFhVAvt4_rvtFbCuR_Rb-aw29o=s0",
  "https://lh3.googleusercontent.com/mxggmgA6wDDXNfSOGM1vY7fyO-JIFZQ56lmgLFsY0mNmpE9GAFWUbvuaxJU5OABi6lhS1HY3etvOoiG1GtNPFvi8IaFA3Q1opgMVLw=s0",
  "https://lh3.googleusercontent.com/aJeB3DFRf8oxX4XPiTULe7y0ZVb_njSI2iaZTmMkI7RVFJpeLw6QBLEm5VdMIczr3EXpJYChbM-GEPNq4dSLjkw5MEZPaMvhUGR5OA=s0",
  "https://lh3.googleusercontent.com/_3F3VyE01AHDOX3Zzity_Sw7BxjrO1j-kwO0_8deZWc4ZJn3c4JEMJ9g26-4RHCBYzayRnakEvLGbvWnYwL8pwOytNfm118nm0poyQ=s0",
  "https://lh3.googleusercontent.com/5C-jEO3zoQL7y663URfke3-Kh_DuuB00Uz7NCksa5THizfo4k2KkITECka6N0lBYA5reP-rPVs82iVFhVAvt4_rvtFbCuR_Rb-aw29o=s0",
  "https://lh3.googleusercontent.com/mxggmgA6wDDXNfSOGM1vY7fyO-JIFZQ56lmgLFsY0mNmpE9GAFWUbvuaxJU5OABi6lhS1HY3etvOoiG1GtNPFvi8IaFA3Q1opgMVLw=s0",
  "https://lh3.googleusercontent.com/_3F3VyE01AHDOX3Zzity_Sw7BxjrO1j-kwO0_8deZWc4ZJn3c4JEMJ9g26-4RHCBYzayRnakEvLGbvWnYwL8pwOytNfm118nm0poyQ=s0",
  "https://lh3.googleusercontent.com/5C-jEO3zoQL7y663URfke3-Kh_DuuB00Uz7NCksa5THizfo4k2KkITECka6N0lBYA5reP-rPVs82iVFhVAvt4_rvtFbCuR_Rb-aw29o=s0",
  "https://lh3.googleusercontent.com/5C-jEO3zoQL7y663URfke3-Kh_DuuB00Uz7NCksa5THizfo4k2KkITECka6N0lBYA5reP-rPVs82iVFhVAvt4_rvtFbCuR_Rb-aw29o=s0",
  "https://lh3.googleusercontent.com/mxggmgA6wDDXNfSOGM1vY7fyO-JIFZQ56lmgLFsY0mNmpE9GAFWUbvuaxJU5OABi6lhS1HY3etvOoiG1GtNPFvi8IaFA3Q1opgMVLw=s0",
  "https://lh3.googleusercontent.com/aJeB3DFRf8oxX4XPiTULe7y0ZVb_njSI2iaZTmMkI7RVFJpeLw6QBLEm5VdMIczr3EXpJYChbM-GEPNq4dSLjkw5MEZPaMvhUGR5OA=s0",
  "https://lh3.googleusercontent.com/_3F3VyE01AHDOX3Zzity_Sw7BxjrO1j-kwO0_8deZWc4ZJn3c4JEMJ9g26-4RHCBYzayRnakEvLGbvWnYwL8pwOytNfm118nm0poyQ=s0",
  "https://lh3.googleusercontent.com/5C-jEO3zoQL7y663URfke3-Kh_DuuB00Uz7NCksa5THizfo4k2KkITECka6N0lBYA5reP-rPVs82iVFhVAvt4_rvtFbCuR_Rb-aw29o=s0",
  "https://lh3.googleusercontent.com/mxggmgA6wDDXNfSOGM1vY7fyO-JIFZQ56lmgLFsY0mNmpE9GAFWUbvuaxJU5OABi6lhS1HY3etvOoiG1GtNPFvi8IaFA3Q1opgMVLw=s0",
  "https://lh3.googleusercontent.com/aJeB3DFRf8oxX4XPiTULe7y0ZVb_njSI2iaZTmMkI7RVFJpeLw6QBLEm5VdMIczr3EXpJYChbM-GEPNq4dSLjkw5MEZPaMvhUGR5OA=s0",
  "https://lh3.googleusercontent.com/_3F3VyE01AHDOX3Zzity_Sw7BxjrO1j-kwO0_8deZWc4ZJn3c4JEMJ9g26-4RHCBYzayRnakEvLGbvWnYwL8pwOytNfm118nm0poyQ=s0",
  "https://lh3.googleusercontent.com/5C-jEO3zoQL7y663URfke3-Kh_DuuB00Uz7NCksa5THizfo4k2KkITECka6N0lBYA5reP-rPVs82iVFhVAvt4_rvtFbCuR_Rb-aw29o=s0",
  "https://lh3.googleusercontent.com/mxggmgA6wDDXNfSOGM1vY7fyO-JIFZQ56lmgLFsY0mNmpE9GAFWUbvuaxJU5OABi6lhS1HY3etvOoiG1GtNPFvi8IaFA3Q1opgMVLw=s0",
  "https://lh3.googleusercontent.com/_3F3VyE01AHDOX3Zzity_Sw7BxjrO1j-kwO0_8deZWc4ZJn3c4JEMJ9g26-4RHCBYzayRnakEvLGbvWnYwL8pwOytNfm118nm0poyQ=s0",
  "https://lh3.googleusercontent.com/5C-jEO3zoQL7y663URfke3-Kh_DuuB00Uz7NCksa5THizfo4k2KkITECka6N0lBYA5reP-rPVs82iVFhVAvt4_rvtFbCuR_Rb-aw29o=s0",
  "https://lh3.googleusercontent.com/5C-jEO3zoQL7y663URfke3-Kh_DuuB00Uz7NCksa5THizfo4k2KkITECka6N0lBYA5reP-rPVs82iVFhVAvt4_rvtFbCuR_Rb-aw29o=s0",
  "https://lh3.googleusercontent.com/mxggmgA6wDDXNfSOGM1vY7fyO-JIFZQ56lmgLFsY0mNmpE9GAFWUbvuaxJU5OABi6lhS1HY3etvOoiG1GtNPFvi8IaFA3Q1opgMVLw=s0",
];

function CollectionImage({ image }) {
  return (
    <div className="flex w-16">
      <img
        className="w-14 h-14 bg-black3 rounded-full flex-shrink-0"
        src={image}
        alt=""
      />
    </div>
  );
}

function CollectionName({ name }) {
  return (
    <div className="w-48 dark:text-white3 text-black5 text-base font-bold capitalize justify-center items-center text-center">
      {name}
    </div>
  );
}

function Info() {
  return (
    <div className="flex flex-1">
      <div className="flex flex-1" />
      <div className="flex flex-col justify-center items-center border-[1px] w-44 h-16 border-white1 dark:border-black4 rounded-l-xl">
        <div className="dark:text-white3 text-black5 text-base font-bold capitalize">
          {"10.0K"}
        </div>
        <div class="text-black6 dark:text-white6 font-normal text-sm capitalize">
          {"items"}
        </div>
      </div>
      <div className="flex flex-col justify-center items-center border-y-[1px] w-44 h-16 border-white1 dark:border-black4">
        <div className="dark:text-white3 text-black5 text-base font-bold capitalize">
          {"6.4K"}
        </div>
        <div class="text-black6 dark:text-white6 font-normal text-sm capitalize">
          {"owners"}
        </div>
      </div>
      <div className="flex flex-col justify-center items-center border-y-[1px] border-l-[1px] w-44 h-16 border-white1 dark:border-black4">
        <div className="dark:text-white3 text-black5 text-base font-bold capitalize">
          {"109.5"}
        </div>
        <div class="text-black6 dark:text-white6 font-normal text-sm capitalize">
          {"floor price"}
        </div>
      </div>
      <div className="flex flex-col justify-center items-center border-[1px] w-44 h-16 border-white1 dark:border-black4 rounded-r-xl">
        <div className="dark:text-white3 text-black5 text-base font-bold capitalize">
          {"491.9K"}
        </div>
        <div class="text-black6 dark:text-white6 font-normal text-sm capitalize">
          {"volume traded"}
        </div>
      </div>
    </div>
  );
}

function TopInfoSection() {
  const {
    state: { name, image },
  } = useLocation();
  return (
    <div className="flex h-24 px-16 items-center dark:bg-black2 bg-white0 mb-2">
      <CollectionImage
        image={
          image ||
          "https://lh3.googleusercontent.com/rLkzGqVwAhXHOTj8FPA9VlJut2ZhcxCaKf3koBH3knHPXU-IyTRKb9DHLFGnHoycIAGZiloBWZXe7jvX0FtDvKkU1NyeAFx9nsPAGA=s300"
        }
      />
      <CollectionName name={name || "tubby cats by tubby collective"} />
      <Info />
    </div>
  );
}

function Switch({ tabular, setTabular }) {
  return (
    <div className="flex flex-1 justify-end items-center mr-4">
      <div class="text-black6 dark:text-white6 font-normal text-sm capitalize mr-4">
        {"Tabular"}
      </div>
      <button
        type="button"
        class={`${
          tabular ? "bg-f2 dark:bg-f2" : "bg-white2 dark:bg-black1"
        } relative inline-flex flex-shrink-0 h-6 w-11 rounded-full cursor-pointer transition-colors ease-in-out duration-200`}
        role="switch"
        aria-checked="false"
        onClick={() => setTabular(!tabular)}
      >
        <span class="sr-only">Use setting</span>
        <span
          aria-hidden="true"
          class={`${
            tabular ? "translate-x-5" : "translate-x-0"
          } pointer-events-none inline-block h-[1.5rem] w-[1.5rem] rounded-full bg-white3 shadow transform transition ease-in-out duration-200`}
        ></span>
      </button>
    </div>
  );
}

function TabsSection() {
  const [tabIndex, setTab] = useState(1);
  const [tabular, setTabular] = useState(false);
  return (
    <div className="h-screen w-full dark:bg-black2 bg-white0">
      <div className="flex pt-4">
        <div className="flex flex-1" />
        <div className="flex">
          <TabHeading
            title={"Holdings"}
            index={1}
            onPress={setTab}
            isSelected={tabIndex == 1}
          />
          <TabHeading
            title={"Profit / Loss"}
            index={2}
            onPress={setTab}
            isSelected={tabIndex == 2}
          />
          <TabHeading
            title={"Analytics"}
            index={3}
            onPress={setTab}
            isSelected={tabIndex == 3}
          />
        </div>
        {tabIndex === 1 ? (
          <Switch tabular={tabular} setTabular={setTabular} />
        ) : (
          <div className="flex flex-1 mr-4" />
        )}
      </div>
      {tabIndex === 1 && (tabular ? <NFTTable /> : <NFTList />)}
    </div>
  );
}

function TabHeading({ title, index, onPress, isSelected }) {
  return (
    <div
      onClick={() => onPress(index)}
      className={`flex items-center text-base font-medium text-black5 dark:text-white3 px-4 h-10 rounded-md cursor-pointer mx-4 ${
        isSelected
          ? "bg-white3 dark:bg-black3"
          : "hover:bg-white4 dark:hover:bg-black3"
      }`}
    >
      {title}
    </div>
  );
}

function NFTList() {
  const {
    state: { name },
  } = useLocation();
  return (
    <ul
      role="list"
      class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 p-8"
    >
      {testData.map((image) => {
        return (
          <li class="col-span-1 flex flex-col text-center bg-white rounded-lg shadow divide-y overflow-hidden">
            <div class="flex-1 flex flex-col">
              <img
                class="w-full h-64 flex-shrink-0 object-fill"
                src={image}
                alt=""
              />
              <div className="flex justify-between py-4 px-4">
                <div className="dark:text-white3 text-black5 text-sm font-medium capitalize">
                  {"#1249"}
                </div>
                <div className="dark:text-white3 text-black5 text-sm font-medium capitalize">
                  {"Ξ 0.2713"}
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function Titles() {
  return (
    <div className="flex dark:bg-black2 bg-white0 h-10 py-2 px-4 mb-1 items-center">
      <div className="flex flex-1 dark:text-white3 text-black5 text-sm font-medium capitalize ml-20">
        {"NFTs"}
      </div>
      <div className="dark:text-white3 text-black5 text-sm font-medium capitalize w-28">
        {"Floor Price"}
      </div>
      <div className="dark:text-white3 text-black5 text-sm font-medium capitalize w-28">
        {"Buy Price"}
      </div>
      <div className="dark:text-white3 text-black5 text-sm font-medium capitalize w-24">
        {"Gas Fee"}
      </div>
    </div>
  );
}

function NFTImage({ image }) {
  return (
    <div className="flex w-12 ml-12">
      <img
        className="w-12 h-12 bg-black3 rounded-lg flex-shrink-0"
        src={image}
        alt=""
      />
    </div>
  );
}

function NFTTokenId({ id }) {
  return (
    <div className="flex flex-1 w-full">
      <h3 className="dark:text-white3 text-black5 text-sm font-medium line-clamp-2 w-5/6 text-center capitalize w-28">
        {id}
      </h3>
    </div>
  );
}

function BuyPrice({ price }) {
  return (
    <div className="dark:text-white3 text-black5 text-sm font-medium capitalize justify-center items-center w-28">
      {`Ξ ${price}`}
    </div>
  );
}

function FloorPrice({ price }) {
  return (
    <div className="dark:text-white3 text-black5 text-sm font-medium capitalize justify-center items-center w-28">
      {`Ξ ${price}`}
    </div>
  );
}

function GasFee({ gasfee }) {
  return (
    <div className="dark:text-white3 text-black5 text-sm font-medium capitalize justify-center items-center w-24 mr-4">
      {gasfee}
    </div>
  );
}

function NFTTable() {
  return (
    <ul role="list">
      <Titles />
      {testData.map((image, index) => {
        return (
          <li
            key={index}
            className="dark:bg-black2 bg-white0 h-16 flex flex-col overflow-hidden hover:bg-white4 dark:hover:bg-black3 cursor-pointer"
          >
            <div className="flex flex-1 items-center justify-around relative">
              <NFTImage image={image} />
              <NFTTokenId id={"#1249"} />
              <BuyPrice price={"213.25"} />
              <FloorPrice price={"164.24"} />
              <GasFee gasfee={"0.000254"} />
            </div>
            <div class="h-[0.0625rem] w-full bg-white5 dark:bg-black8" />
          </li>
        );
      })}
    </ul>
  );
}

export default function CollectionDetail() {
  return (
    <div class="flex flex-col w-full h-full pl-0 md:p-2 md:space-y-4 overflow-scroll">
      <ul role="list" className="px-96">
        <TopInfoSection />
        <TabsSection />
      </ul>
    </div>
  );
}

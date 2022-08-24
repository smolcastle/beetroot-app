import React, { useEffect, useState } from 'react';
import logo4 from '../img/logo4.png';
import ellipse1 from '../img/Ellipse1.png';
import ellipse2 from '../img/Ellipse2.png';
import twitter from '../img/twitter_gum.png';
import discord from '../img/discord_gum.png';
import mediumLogo from '../img/medium_gum.png';
import twitter_f from '../img/twitter_footer.png';
import discord_f from '../img/discord_footer.png';
import medium_f from '../img/medium_footer.png';
import artboard from '../img/Artboard.png';
import asset2 from '../img/asset2.png';
import chatImg from '../img/chat_img.png';
import tradeImg from '../img/trade_img.png';
import { Link } from 'react-router-dom';
import '../animation.css';

function FAQList({ id, title, answer }) {
  const [showFAQ, setShowFAQ] = useState(null);

  return (
    <>
      <div
        onClick={() => {
          showFAQ === null ? setShowFAQ(id) : setShowFAQ(null);
        }}
        className="flex items-center justify-between w-[600px] my-4 cursor-pointer"
      >
        <p className="text-parsley font-questa text-[24px] font-medium">
          {title}
        </p>
        {!showFAQ && (
          <svg
            className="cursor-pointer"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 7.17397L12 16.8252"
              stroke="#4E7B36"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M7.95749 13.3614C9.18417 14.9113 10.0197 15.6325 11.2648 16.5758C11.7054 16.9096 12.2834 16.9096 12.7239 16.5758C13.9691 15.6325 14.8046 14.9113 16.0312 13.3614"
              stroke="#4E7B36"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
        {showFAQ && (
          <svg
            className="cursor-pointer"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 16.826L12 7.1748"
              stroke="#4E7B36"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M16.0347 10.6386C14.808 9.08875 13.9725 8.36748 12.7274 7.42416C12.2868 7.09039 11.7088 7.09039 11.2682 7.42416C10.0231 8.36748 9.18761 9.08875 7.96094 10.6386"
              stroke="#4E7B36"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
      {showFAQ === id && (
        <p className="text-parsley text-[16px] w-[400px]">{answer}</p>
      )}
      <div className="border-b-[2px] border-solid border-gray4 w-[625px]"></div>
    </>
  );
}

function LandingPage() {
  return (
    <div className="h-full w-screen bg-white0 font-rubrik flex flex-col relative md:py-0 md:px-0 overflow-x-hidden">
      <section className="flex h-full justify-between ">
        <div className="flex absolute flex-col w-[55%] lg:pl-24 mb-32 lg:pt-24">
          <img src={logo4} className="w-[48px]" />
          <h1 className="font-questa text-gray1 lg:text-[100px] font-medium mt-16 leading-[100px] w-[90%]">
            NFT marketplace for negotiators
          </h1>
          <div className="mt-16">
            <Link to="/chat" target="_blank" rel="noopener noreferrer">
              <button className="bg-gumtint text-gum text-[24px] font-extrabold w-[250px] px-4 py-2 rounded-[4px]">
                {'< LAUNCH APP />'}
              </button>
            </Link>
          </div>
          <div className="flex justify-between mt-4">
            <button className="bg-parsleytint text-parsley text-[14px] font-medium w-[250px] h-[40px] px-4 py-2 rounded-[4px] eye_cursor">
              Read Launch Announcement
            </button>
            <div className="w-[370px] flex flex-col">
              <p className="text-gray1 text-right text-[36px] font-light">
                Beetroot makes it easy for NFT traders to negogiate deals on
                extraordinary NFTS
              </p>
            </div>
          </div>
          <div className="flex justify-between">
            <div>
              <a
                href="https://twitter.com/beetrootai"
                target="_blank"
                rel="noreferrer"
              >
                <img className="w-[30px] cursor-pointer" src={twitter} />
              </a>
              <img
                className="w-[30px] cursor-pointer eye_cursor mt-4"
                src={discord}
              />
              <img
                className="w-[30px] cursor-pointer eye_cursor mt-4"
                src={mediumLogo}
              />
            </div>
            <div>
              <img className="w-[50px] place-self-end mt-4" src={ellipse2} />
              <img className="w-[50px] place-self-end mt-2" src={ellipse2} />
            </div>
          </div>
        </div>
        <div className="w-[100%] flex justify-end scroll-card overflow-y-scroll lg:pr-24 mb-32 z-10 -mb-32">
          <div className=" h-full relative">
            <img src={ellipse1} className="w-[200px] translate-y-64" />
            <div className="translate-y-[40%]">
              <p className="reenie-beanie text-[32px] text-gum font-medium">
                Chat to negotiate deals...
              </p>
              <img src={chatImg} className="mt-6" />
              <p className="reenie-beanie text-[32px] w-[450px] text-gum font-medium mt-24">
                Create orders by adding NFTS and coins into individual carts...
              </p>
              <img src={tradeImg} />
              <div className="h-[300px]"></div>
            </div>
          </div>
        </div>
      </section>
      <section className="home-section bg-gray7 px-24 pb-24 z-20 mb-20">
        <h1 className="text-[92px] font-medium font-questa text-gum mt-32">
          Discuss every deal that you do.
        </h1>
        <p className="text-[20px] text-gum font-light">
          Due to non-fungible nature of NFTs, their fair prices are hard to
          determine.
        </p>
        <div className="flex flex-col items-center justify-center">
          <div className="flex mt-40 items-center justify-between w-[70%]">
            <div className="w-[550px] ">
              <div className="encryption font-mono grid grid-cols-5 gap-5 p-16 rounded-[8px] bg-gumlight">
                <div className="E bg-gumtint text-gum text-[48px] font-medium text-center rounded-[6px] "></div>
                <div className="N bg-gumtint text-gum text-[48px] font-medium text-center rounded-[6px]"></div>
                <div className="C bg-gumtint text-gum text-[48px] font-medium text-center rounded-[6px]"></div>
                <div className="R bg-gumtint text-gum text-[48px] font-medium text-center rounded-[6px]"></div>
                <div className="Y bg-gumtint text-gum text-[48px] font-medium text-center rounded-[6px]"></div>
                <div className="P bg-gumtint text-gum text-[48px] font-medium text-center rounded-[6px]"></div>
                <div className="T bg-gumtint text-gum text-[48px] font-medium text-center rounded-[6px]"></div>
                <div className="I bg-gumtint text-gum text-[48px] font-medium text-center rounded-[6px]"></div>
                <div className="O bg-gumtint text-gum text-[48px] font-medium text-center rounded-[6px]"></div>
                <div className="N bg-gumtint text-gum text-[48px] font-medium text-center rounded-[6px]"></div>
              </div>
            </div>
            <div className="w-[400px]">
              <h1 className="font-questa text-[48px] font-bold text-gray2 w-[300px]">
                Wallet To Wallet Deals
              </h1>
              <p className="w-[350px] text-[16px] text-gray2 font-normal mt-4">
                Negotiating deals is hard and time consuming. You can never be
                certain that the other user is not scamming you and owns the
                particular NFT. We make it easy to verify the ownership of NFTs.
              </p>
              <p className="w-[350px] text-[16px] text-gray2 font-normal mt-4">
                You can use Beetroot to send encrypted deals to other wallets
                which only they can see.
              </p>
            </div>
          </div>
          <div className="flex mt-40 items-center justify-between w-[70%]">
            <div className="w-[400px]">
              <h1 className="font-questa text-[48px] font-bold text-gray2 w-[300px]">
                Buy With Your NFTs
              </h1>
              <p className="w-[350px] text-[16px] text-gray2 font-normal mt-4">
                Existing marketplaces only let you spend your ETH to buy NFTs.
                You cannot use your NFT to buy another NFT without going through
                multiple trades and paying high fees.
              </p>
              <p className="w-[350px] text-[16px] text-gray2 font-normal mt-4">
                With Beetroot, you can use digital currencies and/or NFTs to buy
                other NFTs in a single trade.
              </p>
            </div>
            <div className="w-[550px] bg-gumlight/[0.5] p-16 rounded-[8px]">
              <img src={artboard} />
            </div>
          </div>
          <div className="flex mt-40 items-center justify-between w-[70%]">
            <div className="w-[550px] h-[300px] bg-gumlight/[0.5]  rounded-[8px]">
              <img
                src={asset2}
                className="h-[350px] place-self-end -mt-[50px]"
              />
            </div>
            <div className="w-[400px] ">
              <h1 className="font-questa text-[48px] font-bold text-gray2 w-[300px]">
                Personalised Offers
              </h1>
              <p className="w-[350px] text-[16px] text-gray2 font-normal mt-4">
                99% offers on NFTs are never aligned to meet your expectations.
                They are mostly bots trying to grab them at huge discounts. We
                give you the ability to negotiate those terms.
              </p>
              <p className="w-[350px] text-[16px] text-gray2 font-normal mt-4">
                With Beetroot, you can make counter offers and discuss details
                so it suits your price expectations.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="mb-36 px-24">
        <div className="flex px-24 justify-between">
          <div className="w-[50%]">
            <h1 className="font-questa text-[48px] font-bold text-gray2 w-[300px]">
              FAQs
            </h1>
            <div className="mt-8">
              <FAQList
                id={1}
                title={'How are messages encrypted?'}
                answer={''}
              />
              <FAQList
                id={2}
                title={'How does NFT trading work on Beetroot?'}
                answer={''}
              />
              <FAQList id={3} title={'What are NFTS?'} answer={''} />
              <FAQList
                id={4}
                title={'Can I receive notifications when I’m offline?'}
                answer={
                  'Yes. You can receive notifications on your telegram, discord or email even when you are offline.'
                }
              />
            </div>
          </div>
          <div className="w-[40%] mt-16 text-[18px] text-gray1 font-normal">
            <p className="w-[200px] ">{"Don't see what you're looking for?"}</p>
            <p className="w-[200px] mt-4">Write to us at </p>
            <a href="mailto:hello@beetroot.ai">
              <span className="text-gum">hello@beetroot.ai</span>
            </a>
            <p className="w-[200px]">
              and we will try our best to answer your query at the earliest.
            </p>
            <div>
              <img
                className="w-[50px] place-self-end mt-8 rotate-180"
                src={ellipse2}
              />
              <img
                className="w-[50px] place-self-end mt-2 rotate-180"
                src={ellipse2}
              />
            </div>
          </div>
        </div>
      </section>
      <footer className="mb-20 px-24">
        <div className="flex flex-col px-24">
          <div className="flex justify-between">
            <div className="bg-gumtint rounded-[8px] w-[400px] p-8 text-gum">
              <h1 className="text-[24px] font-bold">Join the community!</h1>
              <p className="text-[14px] font-normal w-[250px] mt-4">
                Participate in discussions, contribute to our efforts, cheer up
                our devs with memes. Get early access, user rewards and more!
              </p>
              <div className="flex mt-6 w-[30%] justify-between">
                <a
                  href="https://twitter.com/beetrootai"
                  target="_blank"
                  rel="noreferrer"
                >
                  <img className="cursor-pointer" src={twitter_f} />
                </a>
                <img className="cursor-pointer eye_cursor" src={discord_f} />
                <img className="cursor-pointer eye_cursor" src={medium_f} />
              </div>
            </div>
            <Link to="/chat" target="_blank" rel="noopener noreferrer">
              <div className="footer-section w-[800px] h-[250px] rounded-[8px] flex flex-col justify-between py-8 px-12 cursor-pointer">
                <h1 className="font-bold text-[24px] text-gray6">
                  An NFT Marketplace for negotiators
                </h1>
                <h1 className="text-gray6 text-[14px] font-medium">
                  {'< Launch App />'}
                </h1>
              </div>
            </Link>
          </div>
          <p className="text-gray1 text-[14px] mt-4">&copy; Beetroot 2022</p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;

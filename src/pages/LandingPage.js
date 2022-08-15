import logo4 from '../img/logo4.png'
import ellipse1 from '../img/Ellipse1.png'
import ellipse2 from '../img/Ellipse2.png'
import twitter from '../img/twitter_gum.png'
import discord from '../img/discord_gum.png'
import mediumLogo from '../img/medium_gum.png'
import { Link } from 'react-router-dom'

function LandingPage() {
  return (
    <div className="h-full w-screen bg-white0 flex flex-col relative md:py-0 md:px-0 lg:px-24 lg:pt-24">
      <div className="flex h-full font-rubrik justify-between">
        <div className="flex flex-col w-[60%]">
          <img src={logo4} className="w-[48px]" />
          <h1 className="font-questa text-gray1 lg:text-[100px] font-medium mt-16 leading-[100px] w-[90%]">
            NFT marketplace for negotiators
          </h1>
          <div className="mt-16">
            <Link to="/chat">
              <button className="bg-gumtint text-gum text-[24px] font-extrabold w-[250px] px-4 py-2 rounded-[4px]">
                {'< LAUNCH APP />'}
              </button>
            </Link>
          </div>
          <div className="flex justify-between mt-4">
            <button className="bg-parsleytint text-parsley text-[14px] font-medium w-[250px] h-[40px] px-4 py-2 rounded-[4px] eye_cursor">
              Read Launch Announcement
            </button>
            <div className="w-[40%] flex flex-col">
              <p className="text-gray1 text-right text-[36px] font-light">
                Beetroot makes it easy for NFT traders to negogiate deals on
                extraordinary NFTS
              </p>
            </div>
          </div>
          <div className="flex justify-between">
            <div>
              <a href="https://twitter.com/beetrootai" target="_blank">
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
        <div className=" w-[30%]">
          <img src={ellipse1} className="w-[200px]" />
        </div>
      </div>
    </div>
  )
}

export default LandingPage

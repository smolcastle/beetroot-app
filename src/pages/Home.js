import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getCollections } from "../actions/actions"
import { Blockies } from "../components/Blockies"
import Lists from "../components/List"
import Navigation from "../components/Navigation"
import Search from "../components/Search"
import SideNav from "../components/SideNav"
import SortOptions from "../components/SortOptions"
import ThemeBtn from "../components/ThemeBtn"
import { getCollectionsService } from "../services/services"
import Provider from "../utils/Provider"

const WalletButton = () => {
    const address = useSelector((state) => state.wallet.address)

    if (address) return <Blockies address={address} />

    return (
        <button onClick={Provider.connect} type="button" class="py-2 bg-f2 dark:bg-f2 text-black3 dark:text-black3 h-10 text-base font-medium shadow-sm rounded-md w-40">
            {'Connect Wallet'}
        </button>
    )
}

const Logo = () => {
    return (
        <div class="dark:text-white3 text-black5 font-medium text-4xl flex items-center">
            {'Smol Castle'}
        </div>
    )
}

const Header = () => {
    return (
        <div class="flex items-center h-20 bg-white0 dark:bg-black2 shadow-sm px-6">
            <Logo />
            <div class="w-8" />
            <div class="flex flex-[6_6_0%]">
                <Search />
            </div>
            <div class="flex flex-[6_6_0%]" />
            <Navigation />
            <div class="flex flex-1" />
            <ThemeBtn />
            <div class="w-4" />
            <WalletButton />
        </div>
    )
}

const Home = () => {

    const collections = useSelector((state) => state.collections.collections)
    const dispatch = useDispatch()

    // useEffect(() => {
    //     dispatch(getCollections())
    // }, [])

    return (
        <main class="flex flex-1 flex-col bg-white4 dark:bg-black7 h-screen">
            <Header />
            <div class="h-20 z-10 flex justify-center items-center">
                {/* <SortOptions /> */}
            </div>
            <div class="flex flex-col w-full h-full pl-0 md:p-4 md:space-y-4 overflow-scroll">
                <Lists collections={collections} />
            </div>
        </main>
    )
}

export default Home
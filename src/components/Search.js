
const SearchIcon = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mx-2 text-black6 dark:text-white6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
    )
}

export default function Search() {
    return (
        <div class="flex items-center h-12 w-full bg-white4 dark:bg-black3 rounded-md shadow-sm overflow-hidden">
            <SearchIcon />
            <input
                type="text"
                name="search"
                id="search"
                class="w-96 h-full sm:text-sm outline-none text-black5 dark:text-white3 placeholder:text-black6 dark:placeholder:text-white6 bg-white4 dark:bg-black3"
                placeholder="Search for Account, Token, ENS etc."
            />
        </div>
    )
}
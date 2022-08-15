import useDarkMode from '../hooks/useDarkMode'

const Sun = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6 text-white3"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
      />
    </svg>
  )
}

const Moon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6 text-black4"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
    </svg>
  )
}

const ThemeBtn = () => {
  const [colorTheme, setTheme] = useDarkMode()
  const toggleTheme = () => setTheme(colorTheme)
  return (
    <button
      onClick={toggleTheme}
      type="button"
      class="px-3 flex justify-center items-center rounded-md hover:bg-white4 dark:hover:bg-black3 dark:bg-black2 h-10"
    >
      {colorTheme === 'dark' ? <Moon /> : <Sun />}
    </button>
  )
}

export default ThemeBtn

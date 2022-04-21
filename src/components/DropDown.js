import { Fragment } from "react";
import { Popover, Transition } from "@headlessui/react";

export default function DropDown({
  title,
  sortTitle,
  containerStyle,
  boxStyle,
}) {
  const solutions = [
    { name: `${sortTitle} - Low to High`, href: "#" },
    { name: `${sortTitle} - High to Low`, href: "#" },
  ];
  return (
    <Popover className={`relative ${containerStyle}`}>
      {() => (
        <>
          <Popover.Button className={`flex items-center ${boxStyle}`}>
            <div
              className={
                "dark:text-white3 text-black5 text-sm font-medium capitalize"
              }
            >
              {title}
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-4 text-black4 ml-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
              />
            </svg>
          </Popover.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel className="absolute z-10 left-1/4 transform -translate-x-1/2 mt-6 px-2 w-48 max-w-xs sm:px-0">
              <div className="rounded-lg shadow-lg overflow-hidden">
                <div className="relative grid gap-6 bg-white0 px-3 py-4">
                  {solutions.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="-m-2 p-2 block rounded-md transition ease-in-out duration-150 hover:bg-white4 dark:hover:bg-black3"
                    >
                      <p className="text-sm font-light dark:text-white3 text-black5 text-center">
                        {item.name}
                      </p>
                    </a>
                  ))}
                </div>
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
}

import { useSelector, useDispatch } from "react-redux";
import { updateSelectedTab } from "../actions/actions";

const Navigation = () => {
  const { selectedTab, tabs } = useSelector((state) => state.tabs);
  const dispatch = useDispatch();

  const onTabClick = (index) => () => {
    if (index != selectedTab) {
      dispatch(updateSelectedTab(index));
    }
  };

  return (
    <div className="py-4 flex justify-center space-x-2">
      {tabs.map((link) => (
        <a
          key={link.name}
          href={link.href}
          onClick={onTabClick(link.index)}
          className={`flex items-center text-base font-medium text-black5 dark:text-white3 px-4 h-10 rounded-md ${
            link.index === selectedTab
              ? "bg-white3 dark:bg-black3"
              : "hover:bg-white4 dark:hover:bg-black3"
          }`}
        >
          {link.name}
        </a>
      ))}
    </div>
  );
};

export default Navigation;

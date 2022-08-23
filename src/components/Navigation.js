import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { updateSelectedTab } from '../actions/actions';

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
        <Link
          to={link.to}
          key={link.name}
          onClick={onTabClick(link.index)}
          className={`flex items-center text-base font-normal font-newrubrik px-4 h-10 ${
            link.index === selectedTab
              ? 'text-gum '
              : 'eye_cursor text-gumtint'
          }`}
        >
          {link.name}
        </Link>
      ))}
    </div>
  );
};

export default Navigation;

import { combineReducers } from "redux";
import wallet from "./reducers/wallet";
import floorPrices from "./reducers/floorPrices";
import enableUSD from "./reducers/enableUSD";
import tabs from "./reducers/tabs";

export default combineReducers({ wallet, floorPrices, tabs, enableUSD });

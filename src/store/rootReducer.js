import { combineReducers } from "redux";
import wallet from "./reducers/wallet";
import collections from "./reducers/collections";
import tabs from "./reducers/tabs";

export default combineReducers({ wallet, collections, tabs });

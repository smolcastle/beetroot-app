import { combineReducers } from "redux";
import wallet from "./reducers/wallet";
import collections from "./reducers/collections";

export default combineReducers({ wallet, collections })
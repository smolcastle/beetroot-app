import { combineReducers } from "redux";
import wallet from "./reducers/wallet";
import floorPrices from "./reducers/floorPrices";
import enableUSD from "./reducers/enableUSD";
import tabs from "./reducers/tabs";
import messages from "./reducers/messages";
import trades from "./reducers/trades";
import loader from "./reducers/loader";
import newUser from './reducers/newUser'
import users from './reducers/users'

export default combineReducers({
  wallet,
  floorPrices,
  tabs,
  enableUSD,
  messages,
  trades,
  loader,
  newUser,
  users,
});

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import Home from "./pages/Home";
import Provider from "./utils/Provider";

function App() {
  Provider.init(useDispatch());
  useEffect(() => {
    if (Provider.web3Modal.cachedProvider) {
      Provider.connect();
    }
  }, []);

  return <Home />;
}

export default App;

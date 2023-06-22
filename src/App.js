import { useSelector } from "react-redux";
import "./styles/App.scss";
import Splash from "./components/Splash";
import AllRoutes from "./components/AllRoutes";

function App() {
  const { initializing } = useSelector(state => state.home)
  
  if(initializing) {
    return <Splash />;
  }

  return <AllRoutes />;
}

export default App;

import "./styles/App.scss";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import City from "./screens/City";
import Dashboard from "./screens/Dashboard";
import SideLayout from "./components/Layout";
import Brand from "./screens/Brand";
import Location from "./screens/Location";
import store from ".//store/store";
import { Provider } from "react-redux";
import Campaign from "./screens/Campaign";

const router = createBrowserRouter([
  {
    path: "/",
    element: <SideLayout />,
    children: [
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/city",
        element: <City />,
      },
      {
        path: "/brand",
        element: <Brand />,
      },
      {
        path: "/location",
        element: <Location />,
      },
      {
        path: "/campaign",
        element: <Campaign />,
      },
    ],
  },
]);

function App() {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
}

export default App;

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import City from "../screens/City";
import Dashboard from "../screens/Dashboard";
import SideLayout from "../components/Layout";
import ClientBrand from "../screens/ClientBrand";
import Location from "../screens/Location";
import Campaign from "../screens/Campaign";
import Rider from "../screens/Rider";
import Task from "../screens/Task";
import Login from "../screens/Login";
import { authLoader, authPublicLoader } from "../utils/helpers";

function AllRoutes() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <SideLayout />,
      children: [
        {
          path: "/",
          loader: authLoader,
          element: <Dashboard />,
        },
        {
          path: "/city",
          loader: authLoader,
          element: <City />,
        },
        {
          path: "/client&brand",
          loader: authLoader,
          element: <ClientBrand />,
        },
        {
          path: "/location",
          loader: authLoader,
          element: <Location />,
        },
        {
          path: "/campaign",
          loader: authLoader,
          element: <Campaign />,
        },
        {
          path: "/rider",
          loader: authLoader,
          element: <Rider />,
        },
        {
          path: "/task",
          loader: authLoader,
          element: <Task />,
        },
      ],
    },
    {
      path: "/login",
      loader: authPublicLoader,
      element: <Login />,
    },
  ]);
    return <RouterProvider router={router} />;
}

export default AllRoutes;
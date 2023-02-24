import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router";
import { createBrowserRouter } from "react-router-dom";
import Items from "./Items";
import NewEntry from "./NewEntry";
import Overview from "./Overview";
import Places from "./Places";
import Item from "./Item";
import BolusInfo from "./BolusInfo";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";

const router = createBrowserRouter([
  {
    path: "/",
    element: <NewEntry />,
  },
  {
    path: "/overview",
    element: <Overview />,
  },
  {
    path: "/places",
    element: <Places />,
  },
  {
    path: "/places/:id",
    element: <Items />,
  },
  {
    path: "/places/:id/:itemId",
    element: <Item />,
  },
  {
    path: "/bolus_info/:sugar/:foodId",
    element: <BolusInfo />,
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <RouterProvider router={router} />
    </LocalizationProvider>
  </React.StrictMode>
);

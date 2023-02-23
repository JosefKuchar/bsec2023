import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router";
import { createBrowserRouter } from "react-router-dom";
import Items from "./Items";
import NewEntry from "./NewEntry";
import Overview from "./Overview";
import Places from "./Places";

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
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

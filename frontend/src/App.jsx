import React from "react";
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import "./App.css";
import AppLayout from "./layouts/app-layout";
import Login from "./pages/login";
import Dashboard from "./pages/dashboard";
import NotFound from "./pages/not-found";
import AddPatient from "./pages/add-patient";
import Patients from "./pages/patients";
import Appointments from "./pages/appointments";
import Examination from "./pages/examination";
import DrugList from "./pages/drug-list";

const App = () => {
  const isLoggedIn = localStorage.getItem("loggedIn");
  const router = createBrowserRouter([
    {
      path: "/",
      element: isLoggedIn ? <Navigate to={"/dashboard"} replace /> : <Login />,
    },
    {
      element: <AppLayout />,
      children: [
        {
          path: "/dashboard",
          element: <Dashboard />,
        },
        {
          path: "/patients",
          element: <Patients />,
        },
        {
          path: "/add-patients",
          element: <AddPatient />,
        },
        {
          path: "/appointments",
          element: <Appointments />,
        },
        {
          path: "/examination",
          element: <Examination />,
        },
        {
          path: "/drug-list",
          element: <DrugList />,
        },
        {
          path: "*",
          element: <NotFound />,
        },
        //... more routes go here...
      ],
    },
  ]);
  return <RouterProvider router={router} />;
};

export default App;

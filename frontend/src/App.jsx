import './App.css';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from './components/Home';
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Agents from "./pages/Agents";
import UploadTasks from "./pages/UploadTasks";
import TasksByAgent from "./pages/TasksByAgent";
import Dashboard from "./pages/Dashboard";
import NotFound from './components/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
// import { useEffect } from "react";
// import axios from "axios";
// import { useDispatch } from "react-redux";
// import { login } from "./redux/slices/authSlice";
// import { USER_API_ENDPOINT } from "../utils/constant";

function App() {
  // const dispatch = useDispatch();

  // useEffect(() => {
  //   const checkAuth = async () => {
  //     try {
  //       const res = await axios.get(`${USER_API_ENDPOINT}/me`, { withCredentials: true });
  //       if (res.data.success) {
  //         dispatch(login(res.data.user));
  //       }
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   };
  //   checkAuth();
  // }, [dispatch]);

  const appRouter = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/signup",
      element: <Signup />,
    },
    {
      path: "/dashboard",
      element: <ProtectedRoute><Dashboard /></ProtectedRoute>,
      children: [
        {
          path: "agents",
          element: <Agents />,
        },
        {
          path: "upload-tasks",
          element: <UploadTasks />,
        },
        {
          path: "tasks-by-agent",
          element: <TasksByAgent />,
        },
      ],
    },
    {
      path: "*",
      element: <NotFound />,
    },
  ]);

  return <RouterProvider router={appRouter} />;
}

export default App;

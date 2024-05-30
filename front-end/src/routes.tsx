import { createBrowserRouter } from "react-router-dom";
import ErrorPage from "./pages/ErrorPage";
import CreatePage from "./pages/CreatePage";
import HomePage from "./pages/HomePage";
import Layout from "./pages/Layout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "/create", element: <CreatePage /> },
    ],
  },
]);

export default router;
import { createBrowserRouter } from "react-router-dom";
import ErrorPage from "./pages/ErrorPage";
import CreatePage from "./pages/CreatePage";
import HomePage from "./pages/HomePage";
import Layout from "./pages/Layout";
import CompetitionPage from "./pages/CompetitionPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "/create/:competitionName", element: <CreatePage /> },
      { path: "/competition/:competitionName", element: <CompetitionPage />},
    ],
  },
]);

export default router;
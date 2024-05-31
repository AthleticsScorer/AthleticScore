import { createBrowserRouter } from "react-router-dom";
import ErrorPage from "./pages/ErrorPage";
import CreatePage from "./pages/CreatePage";
import HomePage from "./pages/HomePage";
import Layout from "./pages/Layout";
import CompetitionPage from "./pages/CompetitionPage";
import EventPage from "./pages/EventPage";
import ResultsPage from "./pages/ResultsPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "/create/:competitionName", element: <CreatePage /> },
      { path: "/competition/:competitionName", element: <CompetitionPage />},
      { path: "/competition/:competitionName/:eventName", element: <EventPage />},
      { path: "/competition/:competitionName/:eventName/results", element: <ResultsPage />}
    ],
  },
]);

export default router;
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
      { path: "/create/:competitionId", element: <CreatePage /> },
      { path: "/competition/:competitionId", element: <CompetitionPage />},
      { path: "/competition/:competitionId/:eventId", element: <EventPage />},
      { path: "/competition/:competitionId/:eventId/results", element: <ResultsPage />},
      { path: "/competition/:competitionId/:eventId/view", element: <ViewPage />}
    ],
  },
]);

export default router;
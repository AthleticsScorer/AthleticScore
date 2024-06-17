import { createBrowserRouter } from "react-router-dom";
import ErrorPage from "./pages/ErrorPage";
import HomePage from "./pages/HomePage";
import Layout from "./pages/Layout";
import CompetitionPage from "./pages/CompetitionPage";
import ResultsPage from "./pages/ResultsPage";
import ViewPage from "./pages/ViewPage";
import ManagePage from "./pages/ManagePage";
import ViewCompetitionPage from "./pages/ViewCompetitionPage";
import ConfEventsPage from "./pages/ConfEventsPage";
import ConfTeamsPage from "./pages/ConfTeamsPage";
import ViewTeamsPage from "./pages/ViewTeamsPage";
import ConfTeamAthletesPage from "./pages/ConfTeamAthletesPage";
import SearchPage from "./pages/SearchPage";
import CompetitionSearchPage from "./pages/CompetitionSearchPage";
import DetailedResultsPage from "./pages/DetailedResultsPage";
import AthletesEventsResultsPage from "./pages/AthletesEventsResultsPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "/" },
      { path: "/search", element: <SearchPage /> },
      {
        path: "/competition/:competitionId/search",
        element: <CompetitionSearchPage />,
      },
      { path: "/competition/:competitionId/athlete/:athleteId/view", 
        element: <AthletesEventsResultsPage/>},
      { path: "/create/:competitionId", element: <ConfEventsPage /> },
      { path: "/create/:competitionId/teams", element: <ConfTeamsPage /> },
      { path: "/create/:competitionId/viewteams/", element: <ViewTeamsPage /> },
      {
        path: "/create/:competitionId/teams/:teamId",
        element: <ConfTeamAthletesPage />,
      },
      { path: "/manage", element: <ManagePage /> },
      { path: "/competition", element: <ViewCompetitionPage /> },
      { path: "/competition/:competitionId", element: <CompetitionPage /> },
      {
        path: "/competition/:competitionId/details",
        element: <DetailedResultsPage />,
      },
      {
        path: "/competition/:competitionId/:eventId/results",
        element: <ResultsPage />,
      },
      {
        path: "/competition/:competitionId/event/:eventId/view",
        element: <ViewPage />,
      },
    ],
  },
]);

export default router;

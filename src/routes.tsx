import { createBrowserRouter } from "react-router-dom";
import ErrorPage from "./pages/ErrorPage";
import CreatePage from "./pages/CreatePage";
import HomePage from "./pages/HomePage";
import Layout from "./pages/Layout";
import CompetitionPage from "./pages/CompetitionPage";
import EventPage from "./pages/EventPage";
import ResultsPage from "./pages/ResultsPage";
import ViewPage from "./pages/ViewPage";
import TeamPage from "./pages/TeamPage";
import ManagePage from "./pages/ManagePage";
import ManageTeamPage from "./pages/ManageTeamPage";
import ManageEventPage from "./pages/ManageEventPage";
import ViewCompetitionPage from "./pages/ViewCompetitionPage";
import ConfEventsPage from "./pages/ConfEventsPage";
import ConfTeamsPage from "./pages/ConfTeamsPage";
import ViewTeamsPage from "./pages/ViewTeamsPage";
import InformationPage from "./pages/InformationPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "/" },
      { path: "/info", element: <InformationPage />},
      { path: "/create/:competitionId", element: <ConfEventsPage /> },
      { path: "/create/:competitionId/teams", element: <ConfTeamsPage /> },
      { path: "/create/:competitionId/viewteams/", element: <ViewTeamsPage /> },
      { path: "/manage", element: <ManagePage /> },
      { path: "/competition", element: <ViewCompetitionPage /> },
      { path: "/manage/:competitionId/teams", element: <ManageTeamPage /> },
      { path: "/manage/:competitionId/events", element: <ManageEventPage /> },
      { path: "/competition/:competitionId", element: <CompetitionPage /> },
      { path: "/competition/:competitionId/:eventId", element: <EventPage /> },
      {
        path: "/competition/:competitionId/:eventId/results",
        element: <ResultsPage />,
      },
      {
        path: "/competition/:competitionId/:eventId/view",
        element: <ViewPage />,
      },
      { path: "/competition/:competitionId/team", element: <TeamPage /> },
    ],
  },
]);

export default router;

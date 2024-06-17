import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Competition } from "./HomePage";
import {
  Button,
  Center,
  Heading,
  HStack,
  List,
  ListItem,
  VStack,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer
} from "@chakra-ui/react";
import EventsDisplayContainer from "../components/EventsDisplayContainer";
import { Event, Team } from "./CreatePage";
import { Link } from "react-router-dom";

interface DisplayTeam {
  id: number;
  name: String;
  points: number;
}

const CompetitionPage = () => {
  const { competitionId } = useParams();
  const [competition, setCompetition] = useState<Competition>();
  const [events, setEvents] = useState<Event[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [displayTeams, setDisplayTeams] = useState<DisplayTeam[]>([]);

  useEffect(() => {
    axios
      .get(backend + `/competitions/${competitionId}`)
      .then((response) => {
        setCompetition(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  useEffect(() => {
    axios
      .get(backend + `/competitions/${competitionId}/all_events`)
      .then((response) => {
        setEvents(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  useEffect(() => {
    axios
      .get(backend + "/competitions/" + competitionId + "/all_teams")
      .then((response) => {
        setTeams(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [competitionId]);

  async function fetchDisplayTeams() {
    const displayTeamsPromises = teams.map(async (team) => {
      try {
        const response = await axios.get(
          backend + `/teams/${team.id}/total_points`
        );
        return {
          id: team.id,
          name: team.name,
          points: response.data,
        };
      } catch (error) {
        console.error("Error fetching team points data:", error);
        return {
          id: team.id,
          name: "Unknown Team",
          points: 0,
        };
      }
    });

    const resolvedDisplayTeams = await Promise.all(displayTeamsPromises);
    const sortedTeams = resolvedDisplayTeams.sort(
      (a, b) => b.points - a.points
    );
    setDisplayTeams(sortedTeams);
  }

  useEffect(() => {
    fetchDisplayTeams();
  }, [teams]);

  useEffect(() => {
    let timerId = setTimeout(() => {
      fetchDisplayTeams();
    }, 2000);
    return () => {
      clearTimeout(timerId);
    };
  }, [displayTeams]);

  return (
    <>
      <Heading size="xl" paddingLeft={10}>
        {competition?.name}
      </Heading>
      <Center>
        <HStack>
          <VStack>
            <EventsDisplayContainer
              competitionId={Number(competitionId)}
              events={events.map((e) => ({
                id: e.id,
                event_name: e.event_name,
                competition: Number(competitionId),
                age_group: e.age_group,
                event_type: e.event_type,
                complete: e.complete,
              }))}
            />
          </VStack>
          <VStack>
            <Heading>Results</Heading>
            <TableContainer>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Position</Th>
                <Th>Team</Th>
                <Th>Score</Th>
              </Tr>
            </Thead>
            <Tbody>
              {displayTeams.map((team, index) => (
              <Tr>
                <Td>{index + 1}</Td>
                <Td>{team.name}</Td>
                <Td>{team.points}</Td>
              </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
            <Link to={"/competition/" + competitionId + "/details"}>
              <Button>More Results</Button>
            </Link>
          </VStack>
        </HStack>
      </Center>
    </>
  );
};

export default CompetitionPage;

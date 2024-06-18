import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Competition } from "./HomePage";
import {
  Button,
  Box,
  Heading,
  HStack,
  VStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer, Center
} from "@chakra-ui/react";
import EventsDisplayContainer from "../components/EventsDisplayContainer";
import { Event, Team } from "./CreatePage";
import { Link } from "react-router-dom";

interface DisplayTeam {
  id: number;
  team: String;
  points: number;
}

const CompetitionPage = () => {
  const { competitionId } = useParams();
  const [competition, setCompetition] = useState<Competition>();
  const [events, setEvents] = useState<Event[]>([]);
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

  const fetchDisplayTeams = async () => {
    const response = await axios.get(backend + `/competitions/${competitionId}/team_points/`)
    const inTeams: DisplayTeam[] = response.data
    const sortedTeams = inTeams.sort(
      (a, b) => b.points - a.points
    );
    console.log(sortedTeams)
    setDisplayTeams(sortedTeams);
  }

  useEffect(() => {
    console.log("use effect 1")
    fetchDisplayTeams();
  }, [competitionId]);

  useEffect(() => {
    let timerId = setTimeout(() => {
      fetchDisplayTeams();
    }, 2000);
    console.log(displayTeams)
    return () => {
      clearTimeout(timerId);
    };
  }, [displayTeams]);

  return (
    <Box minHeight={"80vh"}>
      <Heading size="xl" paddingLeft={10}>
        {competition?.name}
      </Heading>
      <Center>
        <HStack alignItems="start">
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
                    <Td>{team.team}</Td>
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
    </Box>
  );
};

export default CompetitionPage;

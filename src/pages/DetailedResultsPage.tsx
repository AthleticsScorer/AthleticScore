import { Heading, HStack, List, ListItem, VStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Box
 } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Team } from "./CreatePage";
import { Params, useParams } from "react-router-dom";

interface DisplayTeam {
  id: number;
  team: String;
  points: number;
}

interface Winner {
  string: String;
  age_group: String;
  event_type: String;
  athlete: String;
  team: String;
}

interface WinnerDisplay {
  athlete: String;
  team: String;
  performance: number;
  age_group: String;
  event: String;
  string: String;
  result: number;
}

const DetailedResultsPage = () => {
  const [displayTeams, setDisplayTeams] = useState<DisplayTeam[]>([]);
  const [displayWinners, setDisplayWinners] = useState<WinnerDisplay[]>([]);
  const {competitionId} = useParams<Params>();
  const winnerId = useRef(0);

  const fetchWinners = async () => {
    const response = await axios.get(backend + `/competitions/${competitionId}/best_performers`)
    const filteredWinnerDisplays: WinnerDisplay[] = response.data
    console.log("response")
    console.log(response.data)
    setDisplayWinners(
      filteredWinnerDisplays.sort((a, b) => a.performance - b.performance)
    );
  }

  useEffect(() => {
    fetchWinners();
  }, [competitionId]);

  useEffect(() => {
    let timerId = setTimeout(() => {
      fetchWinners();
    }, 2000);
    return () => {
      clearTimeout(timerId);
    };
  }, [displayWinners]);

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
    let timerId = setTimeout(() => {
      fetchDisplayTeams();
    }, 2000);
    return () => {
      clearTimeout(timerId);
    };
  }, [displayTeams]);

  useEffect(() => {
    fetchDisplayTeams();
  }, [competitionId]);

  return (
    <Box minHeight={"80vh"} alignItems={"center"}>
      <VStack>
        <HStack alignItems="top" spacing="100px">
          <VStack>
          <Heading>Overall Results</Heading>
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
          </VStack>
          <VStack>
          <Heading>Best Performers</Heading>
          <TableContainer>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Position</Th>
                  <Th>Name</Th>
                  <Th>Event</Th>
                  <Th>Performance</Th>
                </Tr>
              </Thead>
              <Tbody>
                {displayWinners.map((winner, index) => (
                <Tr>
                  <Td>{index + 1}</Td>
                  <Td>{winner.athlete}</Td>
                  <Td>{winner.string + " " + winner.age_group + " " + winner.event}</Td>
                  <Td>{winner.performance.toPrecision(4)}</Td>
                </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
          </VStack>
        </HStack>
      </VStack>
    </Box>
  );
};

export default DetailedResultsPage;

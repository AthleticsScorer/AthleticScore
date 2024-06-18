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
  const [teams, setTeams] = useState<Team[]>([]);
  const [displayTeams, setDisplayTeams] = useState<DisplayTeam[]>([]);
  const [winners, setWinners] = useState<Winner[]>([]);
  const [displayWinners, setDisplayWinners] = useState<WinnerDisplay[]>([]);
  const {competitionId} = useParams<Params>();
  const winnerId = useRef(0);

  useEffect(() => {
    axios
      .get(
        backend + "/competitions/" + competitionId + "/winners"
      )
      .then((response) => {
        setWinners(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [competitionId]);

  const fetchWinners = async () => {
    const response = await axios.get(backend + `/competitions/${competitionId}/best_performers`)
    const winnerAthletes: Set<String> = new Set(
      winners.map((winner) => winner.athlete)
    );
    const filteredWinnerDisplays: WinnerDisplay[] = response.data.filter(
      (wd: WinnerDisplay) => winnerAthletes.has(wd.athlete)
    );
    setDisplayWinners(
      filteredWinnerDisplays.sort((a, b) => a.performance - b.performance)
    );
  }

  useEffect(() => {
    fetchWinners();
  }, [winners]);

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
    <Box minHeight={"80vh"}>
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
      <Heading>Best Performers</Heading>
      <List>
        {displayWinners.map((winner, index) => (
          <ListItem key={winnerId.current++} paddingY="5px">
            <HStack>
              <Heading size={"sm"}>{index + 1}</Heading>
              <Heading size={"sm"}>{winner.athlete}</Heading>
              <Heading size={"sm"}>
                {winner.string + " " + winner.age_group + " " + winner.event}
              </Heading>
              <Heading size={"sm"}>{winner.performance.toPrecision(4)}</Heading>
            </HStack>
          </ListItem>
        ))}
      </List>
    </VStack>
    </Box>
  );
};

export default DetailedResultsPage;

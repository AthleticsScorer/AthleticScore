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
  name: String;
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
  const competitionId = useParams<Params>();
  const winnerId = useRef(0);

  useEffect(() => {
    axios
      .get(
        backend + "/competitions/" + competitionId.competitionId + "/all_teams"
      )
      .then((response) => {
        setTeams(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [competitionId]);

  useEffect(() => {
    axios
      .get(
        backend + "/competitions/" + competitionId.competitionId + "/winners"
      )
      .then((response) => {
        setWinners(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [competitionId]);

  useEffect(() => {
    axios
      .get(
        backend +
          "/competitions/" +
          competitionId.competitionId +
          "/best_performers"
      )
      .then((response) => {
        const winnerAthletes: Set<String> = new Set(
          winners.map((winner) => winner.athlete)
        );

        const filteredWinnerDisplays: WinnerDisplay[] = response.data.filter(
          (wd: WinnerDisplay) => winnerAthletes.has(wd.athlete)
        );
        setDisplayWinners(
          filteredWinnerDisplays.sort((a, b) => a.performance - b.performance)
        );
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [winners]);

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
    let timerId = setTimeout(() => {
      fetchDisplayTeams();
    }, 2000);
    return () => {
      clearTimeout(timerId);
    };
  }, [displayTeams]);

  useEffect(() => {
    fetchDisplayTeams();
  }, [teams]);

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
              <Td>{team.name}</Td>
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

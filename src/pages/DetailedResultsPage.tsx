import { Heading, HStack, List, ListItem, VStack } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { Team } from "./CreatePage";
import { Params, useParams } from "react-router-dom";

interface DisplayTeam {
  id: number;
  name: String;
  points: number;
}

const DetailedResultsPage = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [displayTeams, setDisplayTeams] = useState<DisplayTeam[]>([]);
  const competitionId = useParams<Params>();

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
    let timerId = setTimeout(() => {
      fetchDisplayTeams();
    }, 2000);
    return () => {
      clearTimeout(timerId);
    };
  }, [displayTeams]);

  return (
    <VStack>
      <Heading>Overall Results</Heading>
      <List>
        {displayTeams.map((team, index) => (
          <ListItem key={team.id} paddingY="5px">
            <HStack>
              <Heading size={"sm"}>{index + 1}</Heading>
              <Heading size={"sm"}>{team.name}</Heading>
              <Heading size={"sm"}>{team.points}</Heading>
            </HStack>
          </ListItem>
        ))}
      </List>
      <Heading>Results by Age Group (todo)</Heading>
      <Heading>Best Performers (todo)</Heading>
    </VStack>
  );
};

export default DetailedResultsPage;

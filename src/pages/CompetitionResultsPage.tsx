import {
  Center,
  Heading,
  HStack,
  List,
  ListItem,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Team } from "./CreatePage";
import axios from "axios";
import { Params, useParams } from "react-router-dom";

interface DisplayTeam {
  id: number;
  name: String;
  points: number;
}

const CompetitionResultsPage = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [displayTeams, setDisplayTeams] = useState<DisplayTeam[]>([]);
  const {competitionId} = useParams<Params>();

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

  useEffect(() => {
    const fetchDisplayTeams = async () => {
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
          console.error("Error fetching athlete data:", error);
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
    };

    if (teams.length > 0) {
      fetchDisplayTeams();
    }
  }, [teams]);

  return (
    <Center>
      <VStack>
        <Heading>Results</Heading>
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
      </VStack>
    </Center>
  );
};

export default CompetitionResultsPage;

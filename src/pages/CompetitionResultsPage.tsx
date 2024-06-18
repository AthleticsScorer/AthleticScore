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
  team: String;
  points: number;
}

const CompetitionResultsPage = () => {
  const [displayTeams, setDisplayTeams] = useState<DisplayTeam[]>([]);
  const {competitionId} = useParams<Params>();

  useEffect(() => {
    const fetchDisplayTeams = async () => {
      const response = await axios.get(backend + `/competitions/${competitionId}/team_points/`)
      setDisplayTeams(response.data)
      const sortedTeams = displayTeams.sort(
        (a, b) => b.points - a.points
      );
      setDisplayTeams(sortedTeams);
    }
    fetchDisplayTeams();
  }, []);
 

  return (
    <Center>
      <VStack>
        <Heading>Results</Heading>
        <List>
          {displayTeams.map((team, index) => (
            <ListItem key={team.id} paddingY="5px">
              <HStack>
                <Heading size={"sm"}>{index + 1}</Heading>
                <Heading size={"sm"}>{team.team}</Heading>
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

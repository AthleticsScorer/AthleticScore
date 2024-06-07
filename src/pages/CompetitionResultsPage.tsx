import {
  Center,
  Heading,
  HStack,
  List,
  ListItem,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { Team } from "./CreatePage";

const CompetitionResultsPage = () => {
  const [teams, setTeams] = useState<Team[]>([]);

  return (
    <Center>
      <VStack>
        <Heading>Results</Heading>
        <List>
          {teams.map((team, index) => (
            <ListItem key={team.id} paddingY="5px">
              <HStack>
                <Heading size={"sm"}>{index + 1}</Heading>
                <Heading size={"sm"}>{team.name}</Heading>
                {/* <Heading size={"sm"}>{team.value}</Heading> */}
              </HStack>
            </ListItem>
          ))}
        </List>
      </VStack>
    </Center>
  );
};

export default CompetitionResultsPage;

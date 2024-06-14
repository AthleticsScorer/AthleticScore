import { List, ListItem, HStack, Button } from "@chakra-ui/react";
import { Team } from "../pages/CreatePage";

interface Props {
  teams: Team[];
}

const CreatedTeamsContainer = ({ teams }: Props) => {
  return (
    <List>
      {teams.map((team) => (
        <ListItem key={team.id} paddingY="5px">
          <HStack>
            <Button
              whiteSpace="normal"
              textAlign="left"
              fontSize="lg"
              variant="link"
            >
              {team.name}
            </Button>
          </HStack>
        </ListItem>
      ))}
    </List>
  );
};

export default CreatedTeamsContainer;

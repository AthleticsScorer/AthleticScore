import { Button, Center, VStack } from "@chakra-ui/react";
import { Link, useParams } from "react-router-dom";

export interface Event {
  id: number;
  event_name: String;
  competition: number;
  age_group: String;
  event_type: String;
  complete: boolean;
}

export interface Team {
  id: number;
  name: String;
  competition: number;
}

const createPage = () => {
  const { competitionId } = useParams();

  return (
    <Center height={"100vh"}>
      <VStack spacing={10}>
        <Link to={"/manage/" + competitionId + "/teams"}>
          <Button colorScheme="blue" size="lg" type="submit">
            Manage Teams
          </Button>
        </Link>
        <Link to={"/manage/" + competitionId + "/events"}>
          <Button colorScheme="blue" size="lg" type="submit">
            Manage Events
          </Button>
        </Link>
      </VStack>
    </Center>
  );
};

export default createPage;

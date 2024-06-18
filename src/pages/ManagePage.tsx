import { Center, VStack, Button, Text } from "@chakra-ui/react";
import CreateCompetition from "../components/CreateCompetition";
import { Link } from "react-router-dom";

const ManagePage = () => {
  return (
    <Center minHeight={"80vh"}>
      <VStack spacing={10}>
        <CreateCompetition />
        <Link to="/competition">
          <Button colorScheme="blue" size="lg" type="submit">
            <Text>Existing Competitions</Text>
          </Button>
        </Link>
      </VStack>
    </Center>
  );
};

export default ManagePage;

import { Button, Center, HStack, Text, VStack } from "@chakra-ui/react";
import { FaRunning, FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";

export interface Competition {
  id: number;
  name: String;
  date: Date;
  events: Event[];
}

const HomePage = () => {
  return (
    <Center height={"100vh"}>
      <VStack spacing={10}>
        <Link to="/manage">
          <Button colorScheme="blue" size="lg" type="submit">
            <HStack>
              <FaRunning />
              <Text>Manage Competitions</Text>
            </HStack>
          </Button>
        </Link>
        <Link to="/search">
          <Button colorScheme="blue" size="lg" type="submit">
            <HStack>
              <FaSearch />
              <Text>Search Finished Competitions</Text>
            </HStack>
          </Button>
        </Link>
      </VStack>
    </Center>
  );
};

export default HomePage;

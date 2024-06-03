import { Center, VStack } from "@chakra-ui/react";
import CreateCompetition from "../components/CreateCompetition";
import CreatedCompetitionsContainer from "../components/CreatedCompetitionsContainer";

export interface Competition {
  id: number
  name: String
  events: Event[]
}


const HomePage = () => {
  return (
    <Center height={"100vh"}>
        <VStack>
        <CreatedCompetitionsContainer />
        <CreateCompetition/>
        </VStack>
    </Center>
  );
};

export default HomePage;

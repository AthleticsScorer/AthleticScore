import { Center } from "@chakra-ui/react";
import CreateCompetition from "../components/CreateCompetition";

export interface Competition {
  id: number
  name: String
  events: Event[]
}


const HomePage = () => {
  return (
    <Center height={"100vh"}>
        <CreateCompetition/>
    </Center>
  );
};

export default HomePage;

import { Center } from "@chakra-ui/react";
import CreateCompetition from "../components/CreateCompetition";
import { useRef, useState } from "react";

export interface Competition {
  id: number
  name: String
  events: Event[]
}


const HomePage = () => {

  const [competition, setCompetition] = useState<Competition>()
  const currentIdRef = useRef(0);

  const handleAddCompetition = (newCompetitionName: String) => {
    setCompetition({ id: currentIdRef.current++, name: newCompetitionName, events: []});
  };

  return (
    <Center height={"100vh"}>
        <CreateCompetition onAdd={handleAddCompetition}/>
    </Center>
  );
};

export default HomePage;

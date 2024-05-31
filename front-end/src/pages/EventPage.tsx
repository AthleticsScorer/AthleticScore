import { Button, VStack } from "@chakra-ui/react";
import { Link, useParams } from "react-router-dom";
import InputAthlete from "../components/InputAthlete";
import { Athlete } from "../components/InputAthlete";
import { useState } from "react";
import CreatedAthletesContainer from "../components/CreatedAthletesContainer";


const EventPage = () => {

  const [athletes, setAthletes] = useState<Athlete[]>([])
  const { competitionId, eventId } = useParams();

  const handleAddAthlete = (newAthlete: Athlete) => {
    setAthletes([...athletes, newAthlete]);
  };

  return (
    <VStack padding="10px">
      <CreatedAthletesContainer athletes={athletes}/>
      <InputAthlete onAdd={handleAddAthlete}/>
      <Link to={"/competition/" + competitionId + "/" + eventId + "/results"}>
        <Button size="lg">Submit</Button>
        </Link>
    </VStack>
  )
}

export default EventPage
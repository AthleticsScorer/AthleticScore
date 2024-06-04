import { Button, Heading, VStack } from "@chakra-ui/react";
import { Link, useParams } from "react-router-dom";
import InputAthlete from "../components/InputAthlete";
import { Athlete } from "../components/InputAthlete";
import { useEffect, useState } from "react";
import CreatedAthletesContainer from "../components/CreatedAthletesContainer";
import axios from "axios";


const EventPage = () => {

  const [athletes, setAthletes] = useState<Athlete[]>([])
  const [competitionName, setCompetitionName] = useState("")
  const { competitionId, eventId } = useParams();

  const handleAddAthlete = (newAthlete: Athlete) => {
    setAthletes([...athletes, newAthlete]);
  };

  useEffect(() => {
    const fetchCompetitionName = async () => {
      try {
        const response = await axios.get(backend + `/competitions/${competitionId}`);
        setCompetitionName(response.data.name);
      } catch (error) {
        console.error("Error fetching competition data:", error);
        setCompetitionName("Unknown Competition");
      }
    };

    fetchCompetitionName();
  }, [competitionId]);


  return (
    <VStack padding="10px">
        <Heading>{competitionName}</Heading>
      <CreatedAthletesContainer athletes={athletes}/>
      <InputAthlete onAdd={handleAddAthlete} competitionId={Number(competitionId)}/>
      <Link to={"/competition/" + competitionId + "/" + eventId + "/results"}>
        <Button size="lg">Submit</Button>
        </Link>
    </VStack>
  )
}

export default EventPage
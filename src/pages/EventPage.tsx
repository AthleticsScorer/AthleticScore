import { Button, Heading, VStack } from "@chakra-ui/react";
import { Link, useParams } from "react-router-dom";
import InputAthlete from "../components/InputAthlete";
import { Athlete } from "../components/InputAthlete";
import { useEffect, useState } from "react";
import CreatedAthletesContainer from "../components/CreatedAthletesContainer";
import axios from "axios";
import { Team } from "./CreatePage";


const EventPage = () => {

  const [athletes, setAthletes] = useState<Athlete[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [competitionName, setCompetitionName] = useState("")
  const { competitionId, eventId } = useParams();

  const handleAddAthlete = (newAthlete: Athlete) => {
    setAthletes([...athletes, newAthlete]);
  };

  useEffect(() => {
    const fetchCompetitionName = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api" + `/competitions/${competitionId}`);
        setCompetitionName(response.data.name);
      } catch (error) {
        console.error("Error fetching competition data:", error);
        setCompetitionName("Unknown Competition");
      }
    };

    fetchCompetitionName();
  }, [competitionId]);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api" + '/teams/')
      .then(response => {

        const filteredTeams = response.data.filter((e:Team) => e.competition === Number(competitionId));
        setTeams(filteredTeams);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);


  return (
    <VStack padding="10px">
        <Heading>{competitionName}</Heading>
      <CreatedAthletesContainer athletes={athletes}/>
      <InputAthlete onAdd={handleAddAthlete} competitionId={Number(competitionId)} teams={teams}/>
      <Link to={"/competition/" + competitionId}>
        <Button size="lg">Back to Competition</Button>
        </Link>
      <Link to={"/competition/" + competitionId + "/" + eventId + "/results"}>
        <Button size="lg">Submit Results</Button>
        </Link>
    </VStack>
  )
}

export default EventPage
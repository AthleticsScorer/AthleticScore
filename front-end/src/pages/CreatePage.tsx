import { Button, Heading, VStack } from "@chakra-ui/react"
import CreatedEventsContainer from "../components/CreatedEventsContainer";
import InputEvent from "../components/InputEvent";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

export interface Event {
  id: number
  name: String
}

const createPage = () => {
  const [events, setEvents] = useState<Event[]>([])
  const { competitionName } = useParams();
  const [competitionId, setCompetitionId] = useState("")


  const handleAddEvent = (newEvent: Event) => {
    setEvents([...events, newEvent]);
  };

  useEffect(() => {
    axios.post("http://127.0.0.1:8000/api/competitions/", {
          name: competitionName,
        })
        .then(response => {
          setCompetitionId(response.data.id)
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
  }, []);

  return (
    <VStack padding="10px">
      <Heading>{competitionName}</Heading>
      <CreatedEventsContainer events={events}/>
      <InputEvent onAdd={handleAddEvent} competitionId={Number(competitionId)}/>
      <Link to={"/competition/" + competitionId}>
        <Button size="lg">Submit</Button>
      </Link>
    </VStack>
  );
};

export default createPage;

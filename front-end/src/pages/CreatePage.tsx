import { Button, VStack } from "@chakra-ui/react"
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

  useEffect(() => {
    axios.post("http://127.0.0.1:8000/api/competitions/", {
        name: competitionName,
      })
      .then()
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);
  
  const handleAddEvent = (newEvent: Event) => {
    setEvents([...events, newEvent]);
  };

  return (
    <VStack padding="10px">
      <CreatedEventsContainer events={events}/>
      <InputEvent onAdd={handleAddEvent}/>
      <Link to={"/competition/" + competitionName}>
        <Button size="lg">Submit</Button>
      </Link>
    </VStack>
  );
};

export default createPage;

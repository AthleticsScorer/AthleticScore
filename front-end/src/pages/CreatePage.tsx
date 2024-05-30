import { Button, VStack } from "@chakra-ui/react"
import CreatedEventsContainer from "../components/CreatedEventsContainer";
import InputEvent from "../components/InputEvent";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";

export interface Event {
  id: number
  name: String
}

const createPage = () => {
  const [events, setEvents] = useState<Event[]>([])
  const { competitionName } = useParams();

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

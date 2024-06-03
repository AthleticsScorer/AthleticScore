import { Button, Heading, VStack } from "@chakra-ui/react"
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
  const { competitionId } = useParams();


  const handleAddEvent = (newEvent: Event) => {
    setEvents([...events, newEvent]);
  };


  return (
    <VStack padding="10px">
      <Heading>Competition Page</Heading>
      <CreatedEventsContainer events={events}/>
      <InputEvent onAdd={handleAddEvent}/>
      <Link to={"/competition/" + competitionName}>
        <Button size="lg" onClick={handleSubmit}>Submit</Button>
      </Link>
    </VStack>
  );
};

export default createPage;

import { Button, VStack } from "@chakra-ui/react"
import CreatedEventsContainer from "../components/CreatedEventsContainer";
import InputEvent from "../components/InputEvent";
import { useState } from "react";

export interface Event {
  id: number
  name: String
}

const createPage = () => {
  const [events, setEvents] = useState<Event[]>([])

  const handleAddEvent = (newEvent: Event) => {
    setEvents([...events, newEvent]);
  };

  return (
    <VStack padding="10px">
      <CreatedEventsContainer events={events}/>
      <InputEvent onAdd={handleAddEvent}/>
      <Button size="lg">Submit</Button>
    </VStack>
  );
};

export default createPage;

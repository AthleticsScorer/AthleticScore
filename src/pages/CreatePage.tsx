import { Button, Center, Heading, HStack, VStack } from "@chakra-ui/react"
import CreatedEventsContainer from "../components/CreatedEventsContainer";
import InputEvent from "../components/InputEvent";
import InputTeam from "../components/InputTeam";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import CreatedTeamsContainer from "../components/CreatedTeamsContainer";

export interface Event {
  id: number
  event_name: String
  competition: number
  age_group: String,
  event_type: String,
}

export interface Team {
  id: number
  name: String
  competition: number
}

const createPage = () => {
  const [events, setEvents] = useState<Event[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const { competitionId } = useParams();


  const handleAddEvent = (newEvent: Event) => {
    setEvents([...events, newEvent]);
  };

  const handleAddTeam = (newTeam: Team) => {
    setTeams([...teams, newTeam]);
  };


  return (
    <Center height={"100vh"}>
      <VStack spacing={10}>
      <Link to={"/manage/" + competitionId + "/teams"}>
        <Button colorScheme="blue"
        size="lg"
        type="submit">
          Manage Teams
        </Button></Link>
        <Link to={"/manage/" + competitionId + "/events"}>
        <Button colorScheme="blue"
        size="lg"
        type="submit">
          Manage Events
        </Button></Link>
    {/* <HStack padding="20px">
    <VStack padding="10px">
      <Heading>Add Events</Heading>
      <CreatedEventsContainer events={events}/>
      <InputEvent onAdd={handleAddEvent} competitionId={Number(competitionId)}/>
    </VStack>
    <VStack padding="10px">
    <Heading>Add Teams</Heading>
      <CreatedTeamsContainer teams={teams}/>
      <InputTeam onAdd={handleAddTeam} competitionId={Number(competitionId)}/>  
    </VStack>
    </HStack>
    <Link to={"/competition/" + competitionId}>
    <Button size="lg">Submit</Button>
  </Link> */}
  </VStack>
  </Center>
  );
};

export default createPage;

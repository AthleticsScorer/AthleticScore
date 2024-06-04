import { Button, Heading, HStack, VStack } from "@chakra-ui/react"
import CreatedEventsContainer from "../components/CreatedEventsContainer";
import InputEvent from "../components/InputEvent";
import InputTeam from "../components/InputTeam";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import CreatedTeamsContainer from "../components/CreatedTeamsContainer";

export interface Event {
  id: number
  name: String
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
    <VStack>
    <HStack padding="20px">
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
  </Link>
  </VStack>
  );
};

export default createPage;

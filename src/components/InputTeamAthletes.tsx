import axios from "axios";
import { useEffect, useState } from "react";
import { Params, useParams } from "react-router-dom";
import { Event } from "../pages/CreatePage";
import { Heading, Input, SimpleGrid, Box, Button } from "@chakra-ui/react";
import { Athlete } from "./InputAthlete";
import React from "react";

interface Props {
  teamId: number;
}

const InputTeamAthletes = ({ teamId }: Props) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [athleteNames, setAthleteNames] = useState<{ [eventId: number]: string }>({});
  const { competitionId } = useParams<Params>();

  useEffect(() => {
    if (competitionId) {
      axios
        .get("http://127.0.0.1:8000/api/events/")
        .then((response) => {
          const filteredEvents = response.data.filter(
            (e: Event) => e.competition === Number(competitionId)
          );
          setEvents(filteredEvents);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  }, [competitionId, teamId]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>, eventId: number) => {
    setAthleteNames({ ...athleteNames, [eventId]: event.target.value });
  };

  const handleSubmitAthletes = () => {
    const allAthletes: Athlete[] = [];
    Object.keys(athleteNames).forEach((eventId) => {
      const name = athleteNames[Number(eventId)].trim();
      if (name) {
        allAthletes.push({ id: allAthletes.length + 1, name, competition: Number(competitionId) });
      }
    });
    console.log(allAthletes);
  };

  return (
    <>
      <SimpleGrid columns={2} spacing={4}>
        <Box></Box>
        <Box>
          <Heading size="md">Age Group</Heading>
        </Box>
        {events.map((event) => (
          <React.Fragment key={event.id}>
            <Box>
              <Heading size="md">{event.event_name}</Heading>
            </Box>
            <Box>
              <Input
                placeholder="Add Athlete"
                size="md"
                value={athleteNames[event.id] || ""}
                onChange={(e) => handleInputChange(e, event.id)}
              />
            </Box>
          </React.Fragment>
        ))}
      </SimpleGrid>
      <Button onClick={handleSubmitAthletes}>Submit Athletes</Button>
    </>
  );
};

export default InputTeamAthletes;

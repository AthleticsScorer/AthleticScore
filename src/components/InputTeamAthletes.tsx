import axios from "axios";
import { useEffect, useState } from "react";
import { Params, useParams } from "react-router-dom";
import { Event } from "../pages/CreatePage";
import { List, ListItem, HStack, Heading, Input, Button } from "@chakra-ui/react";
import { Athlete } from "./InputAthlete";

interface Props {
  teamId: number;
}

const InputTeamAthletes = ({ teamId }: Props) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [newAthlete, setNewAthlete] = useState<string>("");
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
          console.log(filteredEvents);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  }, [competitionId, teamId]);

  const handleAddAthlete = () => {
    if (newAthlete.trim()) {
      setAthletes([...athletes, { id: athletes.length + 1, name: newAthlete, competition: Number(competitionId) }]);
      setNewAthlete("");
    }
  };

  return (
    <>
      <List>
        {events.map((event) => (
          <ListItem key={event.id} paddingY="5px">
            <HStack>
              <Heading size="md">{event.event_name}</Heading>
              <Input
                placeholder="Add Athlete"
                size="md"
                value={newAthlete}
                onChange={(e) => setNewAthlete(e.target.value)}
              />
              <Button onClick={handleAddAthlete}>Add</Button>
            </HStack>
          </ListItem>
        ))}
      </List>
    </>
  );
};

export default InputTeamAthletes;

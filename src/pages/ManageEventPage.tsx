import { VStack, HStack, Heading, Button } from "@chakra-ui/react";
import axios from "axios";
import { useState, useEffect } from "react";
import { useParams, Params } from "react-router-dom";
import { Event } from "./CreatePage";
import InputEvent from "../components/InputEvent";

const ManageEventPage = () => {
  const competitionId = useParams<Params>();
  const [competitionName, setCompetitionName] = useState("");
  const [events, setEvents] = useState<Event[]>([]);

  const handleAddEvent = (newEvent: Event) => {
    setEvents([...events, newEvent]);
  };

  useEffect(() => {
    const fetchCompetitionName = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api" +
            `/competitions/${competitionId.competitionId}`
        );
        setCompetitionName(response.data.name);
      } catch (error) {
        console.error("Error fetching competition data:", error);
        setCompetitionName("Unknown Competition");
      }
    };

    fetchCompetitionName();
  }, [competitionId]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api" + "/events/")
      .then((response) => {
        const filteredEvents = response.data.filter(
          (e: Event) => e.competition === Number(competitionId.competitionId)
        );
        setEvents(filteredEvents);
        console.log(filteredEvents);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <VStack spacing={5}>
      <HStack spacing={10}>
        <Heading>{competitionName}</Heading>
        <Button colorScheme="blue" size="lg">
          Import Preset
        </Button>
        <Button colorScheme="blue" size="lg">
          Save Preset
        </Button>
      </HStack>
      {events.map((event, index) => (
        <InputEvent
          key={index}
          onAdd={handleAddEvent}
          competitionId={Number(competitionId.competitionId)}
          button={true}
          event_name={event.event_name}
          age_group={event.age_group}
        />
      ))}
      <InputEvent
        onAdd={handleAddEvent}
        competitionId={Number(competitionId.competitionId)}
        button={false}
        event_name={""}
        age_group={""}
      />
    </VStack>
  );
};

export default ManageEventPage;

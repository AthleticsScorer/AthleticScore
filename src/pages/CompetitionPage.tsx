import axios from "axios";
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Competition } from "./HomePage";
import { Button, Center, Heading, VStack } from "@chakra-ui/react";
import EventsDisplayContainer from "../components/EventsDisplayContainer";
import { Event } from "./CreatePage";

const CompetitionPage = () => {
  const { competitionId } = useParams();
  const [data, setData] = useState<Competition[]>([]);
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    axios
      .get(backend + "/competitions/")
      .then((response) => {
        setData(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  useEffect(() => {
    axios
      .get(backend + "/events/")
      .then((response) => {
        const filteredEvents = response.data.filter(
          (e: Event) => e.competition === Number(competitionId)
        );
        setEvents(filteredEvents);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const competition = data.find((comp) => comp.id === Number(competitionId));

  return (
    <>
      <Heading size="xl" paddingLeft={10}>
        {competition?.name}
      </Heading>
      <Center>
        <VStack>
          <EventsDisplayContainer
            competitionId={Number(competitionId)}
            events={events.map((e) => ({
              id: e.id,
              event_name: e.event_name,
              competition: Number(competitionId),
              age_group: e.age_group,
              event_type: e.event_type,
            }))}
          />
          <Link to={"/competition/" + competitionId + "/team"}>
            <Button>Team Input</Button>
          </Link>
        </VStack>
      </Center>
    </>
  );
};

export default CompetitionPage;

import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom"
import { Competition } from "./HomePage";
import { Center, Heading, VStack } from "@chakra-ui/react";
import EventsDisplayContainer from "../components/EventsDisplayContainer";

interface EventCollect {
  id: number,
  age_group: string,
  event_type: string,
  competition: number
}


const CompetitionPage = () => {
  const { competitionId } = useParams();
  const [data, setData] = useState<Competition[]>([]);
  const [events, setEvents] = useState<EventCollect[]>([]);

  useEffect(() => {
    axios.get(backend + '/competitions/')
      .then(response => {
        setData(response.data);
        console.log(response.data)
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  useEffect(() => {
    axios.get(backend + '/events/')
      .then(response => {
        const filteredEvents = response.data.filter((e:EventCollect) => e.competition === Number(competitionId));
        setEvents(filteredEvents);
        console.log(response.data)
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const competition = data.find(comp => comp.id === Number(competitionId));

  // setEvents(events.filter(e => e.competition = competitionName!));

  return (
    <>
    <Center>
      <VStack>
      <Heading>{competition?.name}</Heading>
    <EventsDisplayContainer competitionId={Number(competitionId)} events={events.map(e => ({id: e.id, name: e.age_group}))} />
    </VStack>
    </Center>
    </>
  )
}

export default CompetitionPage
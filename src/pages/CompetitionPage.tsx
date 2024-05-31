import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom"
import { Competition } from "./HomePage";
import { Center, VStack } from "@chakra-ui/react";
import EventsDisplayContainer from "../components/EventsDisplayContainer";

interface EventCollect {
  id: number,
  age_group: string,
  event_type: string,
  competition: string
}


const CompetitionPage = () => {
  const { competitionId } = useParams();
  const [data, setData] = useState<Competition[]>([]);
  const [events, setEvents] = useState<EventCollect[]>([]);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/competitions/')
      .then(response => {
        setData(response.data);
        console.log(response.data)
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/events/')
      .then(response => {
        setEvents(response.data);
        console.log(response.data)
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  // Tests
  const firstCompetitionName = data.length > 0 ? data[0].name : '';

  // setEvents(events.filter(e => e.competition = competitionName!));

  return (
    <>
    <Center>
      <VStack>
    <div>{firstCompetitionName}</div>
    <div>Competition {competitionId}</div>
    <EventsDisplayContainer competitionId={Number(competitionId)} events={events.map(e => ({id: e.id, name: e.age_group}))} />
    </VStack>
    </Center>
    </>
  )
}

export default CompetitionPage
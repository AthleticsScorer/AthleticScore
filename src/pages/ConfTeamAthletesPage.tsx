import {
  Button,
  Heading,
  VStack,
  HStack,
  Input,
  SimpleGrid,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Box
} from "@chakra-ui/react";
import { Params, useNavigate, useParams } from "react-router-dom";
import { Event } from "../pages/CreatePage";
import { useEffect, useState } from "react";
import axios from "axios";

interface Athlete {
  name: String;
  event_id: number;
}

const ConfTeamAthletesPage = () => {
  const [teamName, setTeamName] = useState("");
  const [events, setEvents] = useState<Event[]>([]);
  const [athleteNames, setAthleteNames] = useState<{
    [eventId: number]: String;
  }>({});
  const [inAthletes, setInAthletes] = useState<Athlete[]>([]);
  const [ageGroups, setAgeGroups] = useState<String[]>([]);
  const [eventStrings, setEventStrings] = useState<String[]>([]);
  const { competitionId, teamId } = useParams<Params>();
  const navigate = useNavigate();

  useEffect(() => {
    if (competitionId) {
      axios
        .get(backend + "/events/")
        .then((response) => {
          const filteredEvents = response.data.filter(
            (e: Event) => e.competition === Number(competitionId)
          );
          setEvents(filteredEvents);
          setAgeGroups(
            Array.from(new Set(filteredEvents.map((e: Event) => e.age_group)))
          );
          setEventStrings(
            Array.from(new Set(filteredEvents.map((e: Event) => e.event_name)))
          );
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  }, [competitionId, teamId]);

  useEffect(() => {
    axios
      .get(backend + `/teams/${teamId}/athlete_events`)
      .then((response) => {
        setInAthletes(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  useEffect(() => {
    setAthleteNames(
      Object.assign(
        {},
        ...inAthletes.map((athlete) => ({ [athlete.event_id]: athlete.name }))
      )
    );
  }, [inAthletes]);

  useEffect(() => {
    const fetchTeamName = async () => {
      try {
        const response = await axios.get(backend + `/teams/${teamId}`);
        setTeamName(response.data.name);
      } catch (error) {
        console.error("Error fetching team data:", error);
        setTeamName("Unknown Team");
      }
    };
    fetchTeamName();
  }, [teamId]);

  const handleSubmitAthletes = async () => {
    const allAthletes: Athlete[] = [];
    Object.keys(athleteNames).forEach((eventId) => {
      const name = athleteNames[Number(eventId)].trim();
      if (name) {
        allAthletes.push({
          name,
          event_id: Number(eventId),
        });
      }
    });

    try {
      await axios.post(backend + `/bulk_create/athletes/${teamId}/`, {
        athletes: allAthletes,
      });

      navigate(`../../create/${competitionId}/viewteams`);
    } catch (error) {
      console.error("Error posting athletes:", error);
    }
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    eventId: number
  ) => {
    setAthleteNames({ ...athleteNames, [eventId]: event.target.value });
  };

  return (
    <Box minHeight={"80vh"}>
    <VStack padding="10px">
      <Heading>{teamName}</Heading>
      <Tabs isFitted variant="enclosed">
        <TabList mb="1em">
          {ageGroups.map((ag, index) => (
            <Tab key={index}>{ag}</Tab>
          ))}
        </TabList>
        <TabPanels>
          {ageGroups.map((ag, index) => (
            <TabPanel key={index}>
              <SimpleGrid columns={eventStrings.length} spacing={4}>
                {eventStrings.map((event, index) => (
                  <Box key={index}>
                    <Heading>{event}</Heading>
                  </Box>
                ))}
                {events
                  .filter((event) => event.age_group === ag)
                  .map((event, index) => (
                    <HStack padding="10px" key={event.id}>
                      {index % eventStrings.length == 0 ? (
                        <Box>{event.event_type}</Box>
                      ) : (
                        <></>
                      )}
                      <Box>
                        <Input
                          placeholder="Add Athlete"
                          size="md"
                          value={String(athleteNames[event.id] || "")}
                          onChange={(e) => handleInputChange(e, event.id)}
                        />
                      </Box>
                    </HStack>
                  ))}
              </SimpleGrid>
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>
      <Button onClick={handleSubmitAthletes}>Submit Athletes</Button>
    </VStack>
    </Box>
  );
};

export default ConfTeamAthletesPage;

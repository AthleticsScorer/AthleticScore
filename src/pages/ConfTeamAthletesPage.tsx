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
  Box,
} from "@chakra-ui/react";
import { Params, useParams } from "react-router-dom";
import { Event } from "../pages/CreatePage";
import { useEffect, useState } from "react";
import axios from "axios";

interface Athlete {
  id: number;
  name: String;
  team_id: number;
  event_id: number;
}

const ConfTeamAthletesPage = () => {
  const [teamName, setTeamName] = useState("");
  const [events, setEvents] = useState<Event[]>([]);
  const [athleteNames, setAthleteNames] = useState<{
    [eventId: number]: String;
  }>({});
  const [ageGroups, setAgeGroups] = useState<String[]>([]);
  const [eventStrings, setEventStrings] = useState<String[]>([]);
  const { competitionId, teamId } = useParams<Params>();

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

  const handleSubmitAthletes = () => {
    const allAthletes: Athlete[] = [];
    Object.keys(athleteNames).forEach((eventId) => {
      const name = athleteNames[Number(eventId)].trim();
      if (name) {
        allAthletes.push({
          id: allAthletes.length + 1,
          name,
          event_id: Number(eventId),
          team_id: Number(teamId),
        });
      }
    });
    console.log(allAthletes);
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    eventId: number
  ) => {
    setAthleteNames({ ...athleteNames, [eventId]: event.target.value });
  };

  return (
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
                {eventStrings.map((e, index) => (
                  <Box key={index}>
                    <Heading>{e}</Heading>
                  </Box>
                ))}
                {events
                  .filter((e) => e.age_group === ag)
                  .map((e, index) => (
                    <HStack padding="10px" key={e.id}>
                      {index % eventStrings.length == 0 ? (
                        <Box>{e.event_type}</Box>
                      ) : (
                        <></>
                      )}
                      <Box>
                        <Input
                          placeholder="Add Athlete"
                          size="md"
                          value={String(athleteNames[e.id] || "")}
                          onChange={(f) => handleInputChange(f, e.id)}
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
  );
};

export default ConfTeamAthletesPage;

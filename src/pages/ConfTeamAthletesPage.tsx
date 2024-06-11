import { Button, Heading, VStack, HStack, Input, Center, IconButton, Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import { Params, useParams } from "react-router-dom";
import { Event } from "../pages/CreatePage";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

interface Athlete {
    team:
}

const ConfTeamAthletesPage = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const { competitionId } = useParams<Params>();

    useEffect(() => {
        if (competitionId) {
          axios
            .get(backend + "/events/")
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
    }, []);

    return (
        <VStack padding="10px">
            <Tabs isFitted variant='enclosed'>
                <TabList mb='1em'>
                    {ageGroups.map((ag) =>(
                        <Tab>{ag}</Tab>
                    ))}
                </TabList>
                <TabPanels>
                    <TabPanel>
                    <p>one!</p>
                    </TabPanel>
                    <TabPanel>
                    <p>two!</p>
                    </TabPanel>
                </TabPanels>
                </Tabs>
        </VStack>
    )
}

export default ConfTeamAthletesPage
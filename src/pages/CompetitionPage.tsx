import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Competition } from "./HomePage";
import {
  Button,
  Center,
  Heading,
  HStack,
  List,
  ListItem,
  VStack,
} from "@chakra-ui/react";
import EventsDisplayContainer from "../components/EventsDisplayContainer";
import { Event, Team } from "./CreatePage";
import { Link } from "react-router-dom";

interface DisplayTeam {
  id: number;
  name: String;
  points: number;
}

const CompetitionPage = () => {
  const { competitionId } = useParams();
  const [data, setData] = useState<Competition[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [displayTeams, setDisplayTeams] = useState<DisplayTeam[]>([]);

  useEffect(() => {
    axios
      .get(backend + "/competitions/")
      .then((response) => {
        setData(response.data);
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
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  useEffect(() => {
    axios
      .get(backend + "/competitions/" + competitionId + "/all_teams")
      .then((response) => {
        setTeams(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [competitionId]);

  async function fetchDisplayTeams () {
      const displayTeamsPromises = teams.map(async (team) => {
        try {
          const response = await axios.get(
            backend + `/teams/${team.id}/total_points`
          );
          return {
            id: team.id,
            name: team.name,
            points: response.data,
          };
        } catch (error) {
          console.error("Error fetching team points data:", error);
          return {
            id: team.id,
            name: "Unknown Team",
            points: 0,
          };
        }
      });

      const resolvedDisplayTeams = await Promise.all(displayTeamsPromises);
      const sortedTeams = resolvedDisplayTeams.sort(
        (a, b) => b.points - a.points
      );
      setDisplayTeams(sortedTeams);
  };

  useEffect(() => {
    let timerId = setTimeout(() => {
      fetchDisplayTeams();
    }, 2000)
    return () => {
      clearTimeout(timerId)
    }
  }, [displayTeams]);

  const competition = data.find((comp) => comp.id === Number(competitionId));

  return (
    <>
      <Heading size="xl" paddingLeft={10}>
        {competition?.name}
      </Heading>
      <Center>
        <HStack>
          <VStack>
            <EventsDisplayContainer
              competitionId={Number(competitionId)}
              events={events.map((e) => ({
                id: e.id,
                event_name: e.event_name,
                competition: Number(competitionId),
                age_group: e.age_group,
                event_type: e.event_type,
                complete: e.complete,
              }))}
            />
          </VStack>
          <VStack>
            <Heading>Results</Heading>
            <List>
              {displayTeams.map((team, index) => (
                <ListItem key={team.id} paddingY="5px">
                  <HStack>
                    <Heading size={"sm"}>{index + 1}</Heading>
                    <Heading size={"sm"}>{team.name}</Heading>
                    <Heading size={"sm"}>{team.points}</Heading>
                  </HStack>
                </ListItem>
              ))}
            </List>
            <Link to={"/competition/" + competitionId + "/details"}>
              <Button>More Results</Button>
            </Link>
          </VStack>
        </HStack>
      </Center>
    </>
  );
};

export default CompetitionPage;

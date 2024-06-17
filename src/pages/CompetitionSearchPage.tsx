import {
  Button,
  HStack,
  Input,
  Select,
  Text,
  VStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Link, Params, useParams } from "react-router-dom";
import { Event, Team } from "./CreatePage";
import { Athlete } from "../components/InputAthlete";

const CompetitionSearchPage = () => {
  const {competitionId} = useParams<Params>();
  const [searchValue1, setSearchValue1] = useState("");
  const [searchValue2, setSearchValue2] = useState("");
  const [searchValue3, setSearchValue3] = useState("");
  const [events, setEvents] = useState<Event[]>([]);
  const [isEvent, setIsEvent] = useState(true);
  const [isAthlete, setIsAthlete] = useState(false);
  const [inEvents, setInEvents] = useState<Event[]>([])
  const [inTeams, setInTeams] = useState<Team[]>([])
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [searchType, setSearchType] = useState("");

  const handleSearchType = (type: string) => {
    setSearchType(type);
    setIsEvent(type === "Events");
    setIsAthlete(type === "Athletes");
    setSearchValue1("");
    setSearchValue2("");
    setSearchValue3("");
  };

  useEffect(() => {
    axios
      .get(backend + "/events/")
      .then((response) => {
        const filteredEvents = response.data.filter(
          (e: Event) => e.competition === Number(competitionId)
        );
        setInEvents(filteredEvents);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [competitionId]);

  useEffect(() => {
    axios
      .get(backend + "/competitions/" + competitionId + "/all_teams")
      .then((response) => {
        console.log(competitionId);
        setInTeams(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [competitionId]);

  const handleSearch = async () => {
    console.log("searching");
    try {
      if (searchType == "Events") {
        console.log("search events");
        const response = await axios.get(
          backend + `/events/filter/?event_age_category=` + searchValue1
          + `&event_name=` + searchValue2 + `&event_type=` + searchValue3 
          + `&competition_id=` + Number(competitionId)
        );
        setEvents(response.data);
      } else if (searchType == "Athletes") {
        console.log("search athletes");
        const response = await axios.get(
          backend + `/athletes/filter/?athlete_name=` + searchValue1.replace(/ /g, "+")
          + `&athlete_organisation=` + searchValue2.replace(/ /g, "+") + `&competition_id=`
          + Number(competitionId)
        );
        setAthletes(response.data);
      }
    } catch (error) {
      console.error("Error searching data:", error);
    }
  };

  function searchInputs(searchType: String) {
    if (searchType === "Events") {
      return (<HStack>
        <Select
          placeholder="Age group..."
          minW="150px"
          size="lg"
          value={searchValue1}
          onChange={(e) => setSearchValue1(e.target.value)}
        >
        {Array.from(new Set(inEvents.map((e) => e.age_group))).map((age_group) => (
          <option value={String(age_group)}>{age_group}</option>
        ))}
        </Select>
        <Select
          placeholder="Event string..."
          minW="150px"
          size="lg"
          value={searchValue2}
          onChange={(e) => setSearchValue2(e.target.value)}
        >
        {Array.from(new Set(inEvents.map((e) => e.event_name))).map((event_name) => (
          <option value={String(event_name)}>{event_name}</option>
        ))}
        </Select>
        <Select
          placeholder="Event type..."
          minW="150px"
          size="lg"
          value={searchValue3}
          onChange={(e) => setSearchValue3(e.target.value)}
        >
        {Array.from(new Set(inEvents.map((e) => e.event_type))).map((event_type) => (
          <option value={String(event_type)}>{event_type}</option>
        ))}
        </Select>
      </HStack>)
    };

    if (searchType === "Athletes") {
      return (
        <HStack>
        <Input
          placeholder={"Athlete name..."}
          size={"lg"}
          value={searchValue1}
          onChange={(e) => setSearchValue1(e.target.value)}
        ></Input>
        <Select
          placeholder="Team Name"
          minW="150px"
          size="lg"
          value={searchValue2}
          onChange={(e) => setSearchValue2(e.target.value)}
        >
        {Array.from(new Set(inTeams.map((t) => (t.name)))).map((name) => (
          <option value={String(name)}>{name}</option>
        ))}
        </Select>
        </HStack>
      )
    }
  }

  function getTeamNameFromId(id: Number) {
    for (const team of inTeams) {
      if (team.id === id) {
        return team.name
      }
    }
  }

  return (
    <VStack>
      <HStack>
      <Select
          placeholder="Select a filter"
          size="lg"
          maxW="150px"
          value={searchType}
          onChange={(e) => handleSearchType(e.target.value)}
        >
          <option value="Events">Event</option>
          <option value="Athletes">Athlete</option>
        </Select>
        {searchInputs(searchType)}
       
        <Button colorScheme="blue" size="lg" onClick={handleSearch}>
          <Text>Search</Text>
        </Button>
      </HStack>
      <TableContainer>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Filter Results</Th>
              </Tr>
            </Thead>
            <Tbody>
              {isEvent && events.map((event) => (
                <Tr>
                <Td>
                <Link to={"/competition/" + competitionId + "/" + event.id + "/view"}>
                  <Button size="md" textAlign="center" minW="400px">
                    {event.age_group + " " +event.event_name + " " + event.event_type}
                  </Button>
                </Link>
                </Td>
                </Tr>
              ))}
              {isAthlete && athletes.map((athlete) => (
                <Tr>
                <Td>
              <Link to={"/competition/" + competitionId + "/" + athlete.id + "/view"}>
                <Button size="md" textAlign="center" minW="400px">
                  {athlete.name + " - " + getTeamNameFromId(Number(athlete.team))}
                </Button>
              </Link>
              </Td>
              </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
    </VStack>
  );
};

export default CompetitionSearchPage;

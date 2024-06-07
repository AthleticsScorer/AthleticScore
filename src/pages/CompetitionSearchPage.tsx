import {
  Box,
  Button,
  Heading,
  HStack,
  Input,
  Select,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import React from "react";
import { Link, Params, useParams } from "react-router-dom";
import { Event } from "./CreatePage";
import { Athlete } from "../components/InputAthlete";
import { Result } from "../components/InputResult";

interface DisplayResult {
  id: number;
  value: number;
  name: String;
}

const CompetitionSearchPage = () => {
  const [searchValue, setSearchValue] = useState("");
  const [events, setEvents] = useState<Event[]>([]);
  const [isEvent, setIsEvent] = useState(true);
  const [isAthlete, setIsAthlete] = useState(false);
  const [isResult, setIsResult] = useState(false);
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [results, setResults] = useState<Result[]>([]);
  const [searchType, setSearchType] = useState("Events");
  const [displayResults, setDisplayResults] = useState<DisplayResult[]>([]);
  const competitionId = useParams<Params>();

  const handleSearchType = (type: string) => {
    setSearchType(type);
    setIsEvent(type === "Events");
    setIsAthlete(type === "Athletes");
    setIsResult(type === "Results");
  };

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api" + "/events/")
      .then((response) => {
        const filteredEvents = response.data.filter(
          (e: Event) => e.competition === Number(competitionId.competitionId)
        );
        setEvents(filteredEvents);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api" + "/athletes/")
      .then((response) => {
        const filteredAthletes = response.data.filter(
          (e: Athlete) => e.competition === Number(competitionId)
        );
        setAthletes(response.data);
        // console.log(response.data)
        // console.log(competitionId)
        // console.log(filteredAthletes)
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api" + "/results/")
      .then((response) => {
        setResults(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  useEffect(() => {
    const fetchResultwithAthlete = async () => {
      const filteredResults = results;
      const displayResultsPromises = filteredResults.map(async (result) => {
        try {
          const response = await axios.get(
            "http://127.0.0.1:8000/api" + `/athletes/${result.athlete}`
          );
          const athleteName = response.data.name;
          return {
            id: result.id,
            name: athleteName,
            value: Number(result.value),
          };
        } catch (error) {
          console.error("Error fetching athlete data:", error);
          return {
            id: result.id,
            name: "Unknown Athlete",
            value: Number(result.value),
          };
        }
      });

      const resolvedDisplayResults = await Promise.all(displayResultsPromises);
      setDisplayResults(resolvedDisplayResults);
    };

    if (results.length > 0) {
      fetchResultwithAthlete();
    }
  }, [results]);

  return (
    <VStack>
      <HStack>
        <Input
          placeholder={"Search " + searchType + "..."}
          size={"lg"}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        ></Input>
        <Select
          placeholder="Event"
          size="lg"
          value={searchType}
          onChange={(e) => handleSearchType(e.target.value)}
        >
          <option value="Events">Event</option>
          <option value="Athletes">Athlete</option>
          <option value="Results">Result</option>
        </Select>
        <Button colorScheme="blue" size="lg">
          <Text>Search</Text>
        </Button>
      </HStack>
      <SimpleGrid columns={1} spacing={4}>
        <Box>
          <Heading size="md">Name</Heading>
        </Box>
        {isEvent &&
          events.map((event) => (
            <React.Fragment key={event.id}>
              <Box>
                <Link to={"/competition/" + competitionId.competitionId + "/" + event.id + "/view"}>
                  <Heading size="md">{event.event_name}</Heading>
                </Link>
              </Box>
            </React.Fragment>
          ))}
        {isAthlete &&
          athletes.map((athlete) => (
            <React.Fragment key={athlete.id}>
              <Box>
                  <Heading size="md">{athlete.name}</Heading>
              </Box>
            </React.Fragment>
          ))}
        {isResult &&
          displayResults.map((result) => (
            <React.Fragment key={result.id}>
              <Box>
                  <Heading size="md">
                    {result.name + " " + result.value}
                  </Heading>
              </Box>
            </React.Fragment>
          ))}
      </SimpleGrid>
    </VStack>
  );
};

export default CompetitionSearchPage;

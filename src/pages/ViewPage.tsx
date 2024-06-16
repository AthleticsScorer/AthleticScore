import { Heading, HStack, List, ListItem, VStack } from "@chakra-ui/react";
import { Result } from "../components/InputResult";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

interface DisplayResult {
  id: number;
  athleteName: String;
  value: number;
}

const ViewPage = () => {
  const [results, setResults] = useState<Result[]>([]);
  const { competitionId, eventId } = useParams();
  const [competitionName, setCompetitionName] = useState("");
  const [eventName, setEventName] = useState("");
  const [displayResults, setDisplayResults] = useState<DisplayResult[]>([]);
  const resultId = useRef(0);

  useEffect(() => {
    axios
      .get(backend + "/results/")
      .then((response) => {
        setResults(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  useEffect(() => {
    const fetchAthleteNames = async () => {
      const filteredResults = results.filter(
        (r) => r.event === Number(eventId)
      );
      const displayResultsPromises = filteredResults.map(async (result) => {
        try {
          const response = await axios.get(
            backend + `/athletes/${result.athlete}`
          );
          const athleteName = response.data.name;
          return {
            id: resultId.current++,
            athleteName: athleteName,
            value: Number(result.value),
          };
        } catch (error) {
          console.error("Error fetching athlete data:", error);
          return {
            id: -1,
            athleteName: "Unknown Athlete",
            value: Number(result.value),
          };
        }
      });

      const resolvedDisplayResults = await Promise.all(displayResultsPromises);
      const sortedResults = resolvedDisplayResults.sort(
        (a, b) => a.value - b.value
      );

      setDisplayResults(sortedResults);
    };

    if (results.length > 0) {
      fetchAthleteNames();
    }
  }, [results]);

  useEffect(() => {
    const fetchCompetitionName = async () => {
      try {
        const response = await axios.get(
          backend + `/competitions/${competitionId}`
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
    const fetchEventName = async () => {
      try {
        const response = await axios.get(backend + `/events/${eventId}`);
        setEventName(response.data.age_group);
      } catch (error) {
        console.error("Error fetching event data:", error);
        setEventName("Unknown Event");
      }
    };
    fetchEventName();
  }, [eventId]);

  return (
    <>
      <VStack>
        <Heading>{competitionName + " " + eventName}</Heading>
        <List>
          {displayResults.map((result, index) => (
            <ListItem key={result.id} paddingY="5px">
              <HStack>
                <Heading size={"sm"}>{index + 1}</Heading>
                <Heading size={"sm"}>{result.athleteName}</Heading>
                <Heading size={"sm"}>{result.value}</Heading>
              </HStack>
            </ListItem>
          ))}
        </List>
      </VStack>
    </>
  );
};

export default ViewPage;

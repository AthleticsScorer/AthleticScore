import { Heading, HStack, List, ListItem, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

interface DisplayResult {
  id: number;
  athleteName: String;
  value: number;
}

interface RankedResult {
  rank: number;
  Distance: number;
  athlete_name: String;
  points: number;
}

const ViewPage = () => {
  const [results, setResults] = useState<RankedResult[]>([]);
  const { competitionId, eventId } = useParams();
  const [competitionName, setCompetitionName] = useState("");
  const [eventName, setEventName] = useState("");

  useEffect(() => {
    axios
      .get(
        "http://127.0.0.1:8000/api" + "/events/" + eventId + "/ranked_athletes"
      )
      .then((response) => {
        setResults(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  useEffect(() => {
    const fetchCompetitionName = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api" + `/competitions/${competitionId}`
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
        const response = await axios.get(
          "http://127.0.0.1:8000/api" + `/events/${eventId}`
        );
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
          {results.map((result) => (
            <ListItem key={result.rank} paddingY="5px">
              <HStack>
                <Heading size={"sm"}>{result.rank}</Heading>
                <Heading size={"sm"}>{result.athlete_name}</Heading>
                <Heading size={"sm"}>{result.Distance}</Heading>
                <Heading size={"sm"}>{result.points}</Heading>
              </HStack>
            </ListItem>
          ))}
        </List>
      </VStack>
    </>
  );
};

export default ViewPage;

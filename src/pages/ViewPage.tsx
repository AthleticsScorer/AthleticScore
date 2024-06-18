import { Heading, VStack, 
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Box,
  TableContainer, } from "@chakra-ui/react";
import { Result } from "../components/InputResult";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

interface DisplayResult {
  id: number;
  rank: number;
  athlete_name: String;
  result: number;
  points: number;
}

const ViewPage = () => {
  const { competitionId, eventId } = useParams();
  const [competitionName, setCompetitionName] = useState("");
  const [eventName, setEventName] = useState("");
  const [displayResults, setDisplayResults] = useState<DisplayResult[]>([]);

  useEffect(() => {
    const fetchDisplayResults = async () => {
      const response = await axios.get(
        backend + `/events/${eventId}/ranked_athletes`
      );
      setDisplayResults(response.data);
    };

    fetchDisplayResults();
    console.log(displayResults);
  }, []);

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
        setEventName(response.data.age_group + " " + response.data.event_name + " " + response.data.event_type);
      } catch (error) {
        console.error("Error fetching event data:", error);
        setEventName("Unknown Event");
      }
    };
    fetchEventName();
  }, [eventId]);

  return (
    <Box minHeight={"80vh"}>
      <VStack>
        <Heading>{competitionName + " " + eventName}</Heading>
        <TableContainer>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Position</Th>
                <Th>Athlete</Th>
                <Th>Result</Th>
              </Tr>
            </Thead>
            <Tbody>
              {displayResults.map(result => (
              <Tr>
                <Td>{result.rank}</Td>
                <Td>{result.athlete_name}</Td>
                <Td>{result.result}</Td>
              </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </VStack>
    </Box>
  );
};

export default ViewPage;

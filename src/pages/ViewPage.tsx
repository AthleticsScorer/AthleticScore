import { Heading, HStack, List, ListItem, VStack, 
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer, } from "@chakra-ui/react";
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
      const response = await axios.get(
        backend + `/events/${eventId}`
      );
      setDisplayResults(response.data);
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
        <TableContainer>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Position</Th>
                <Th>Athlete</Th>
                <Th>Score</Th>
              </Tr>
            </Thead>
            <Tbody>
              {displayResults.map((result, index) => (
              <Tr>
                <Td>{index + 1}</Td>
                <Td>{result.athleteName}</Td>
                <Td>{result.value}</Td>
              </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </VStack>
    </>
  );
};

export default ViewPage;

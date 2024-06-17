import { Heading, VStack, 
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer, } from "@chakra-ui/react";
  import { Result } from "../components/InputResult";
  import { useEffect, useRef, useState } from "react";
  import { useParams } from "react-router-dom";
  import axios from "axios";
  
  interface DisplayResult {
    id: number;
    eventString: String;
    ageGroup: String;
    eventType: String;
    value: number;
  }

  
  const AthletesEventsResultsPage = () => {
    const [results, setResults] = useState<Result[]>([]);
    const { competitionId, athleteId } = useParams();
    const [competitionName, setCompetitionName] = useState("");
    const [athleteName, setAthleteName] = useState("");
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
      const fetchEventsNames = async () => {
        const filteredResults = results.filter(
          (r) => r.athlete === Number(athleteId)
        );
        const displayResultsPromises = filteredResults.map(async (result) => {
          try {
            const response = await axios.get(
              backend + `/events/${result.event}`
            );
            const eventString = response.data.event_name;
            const ageGroup = response.data.age_group;
            const eventType = response.data.event_type;
            return {
              id: resultId.current++,
              eventString: eventString,
              ageGroup: ageGroup,
              eventType: eventType,
              value: Number(result.value),
            };
          } catch (error) {
            console.error("Error fetching athlete data:", error);
            return {
              id: -1,
              eventString: "unknown",
              ageGroup: "unknown",
              eventType: "unknown",
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
        fetchEventsNames();
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
      const fetchAthleteName = async () => {
        try {
          const response = await axios.get(backend + `/athletes/${athleteId}`);
          setAthleteName(response.data.name);
        } catch (error) {
          console.error("Error fetching event data:", error);
          setAthleteName("Unknown Event");
        }
      };
      fetchAthleteName();
    }, [athleteId]);
  
    return (
      <>
        <VStack>
          <Heading>{competitionName + " " + athleteName}</Heading>
          <TableContainer>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Event</Th>
                  <Th>Score</Th>
                </Tr>
              </Thead>
              <Tbody>
                {displayResults.map((result) => (
                <Tr>
                  <Td>{result.ageGroup + " " + result.eventString + " " + result.eventType}</Td>
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
  
  export default AthletesEventsResultsPage;
  
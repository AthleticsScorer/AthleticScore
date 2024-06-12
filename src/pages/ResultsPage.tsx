import {
  Button,
  Heading,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  VStack,
  Input
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Link, useParams, Params, useNavigate } from "react-router-dom";
import axios from "axios";
import { Team } from "./CreatePage";
import InputAthlete, { Athlete } from "../components/InputAthlete";

interface Result {
  value: String;
  athlete_id: number;
}

interface InResult {
  value: String;
  athlete_id: number;
  athlete: String;
  team: String;
}

const ResultsPage = () => {
  const [results, setResults] = useState<Result[]>([]);
  const [resultsVals, setResultsVals] = useState<{
    [athleteId: number]: String;
  }>({});
  const [competitionName, setCompetitionName] = useState("");
  const [eventName, setEventName] = useState("");
  const [inResults, setInResults] = useState<InResult[]>([]);
  const { competitionId, eventId } = useParams<Params>();

  const navigate = useNavigate();

  const handleSubmitResults = async () => {
    const allResults: Result[] = [];
    Object.keys(resultsVals).forEach((athleteId) => {
      const value = resultsVals[Number(athleteId)].trim();
      if (value) {
        allResults.push({
          value,
          athlete_id: Number(athleteId)
        });
      }
    });
    console.log(allResults);
    try {
      await axios.post(backend + `/bulk_create/results/${eventId}/`, {
        results: allResults,
      });

      navigate(`../../competition/${competitionId}/`);
    } catch (error) {
      console.error("Error posting athletes:", error);
    }
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    athleteId: number
  ) => {
    setResultsVals({ ...resultsVals, [athleteId]: event.target.value });
  };
  
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
    axios
      .get(backend + "/events/" + eventId + "/all_results")
      .then((response) => {
        setInResults(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  useEffect(() => {
    inResults.forEach(inResult => {
      setResultsVals({...resultsVals, [inResult.athlete_id]: inResult.value});
    });
  }, [inResults]);

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
        <Heading>{competitionName + " - " + eventName}</Heading>
        <TableContainer>
          <Table variant={"simple"}>
            <Thead>
              <Tr>
                <Th>Team</Th>
                <Th>Name</Th>
                <Th isNumeric>Result</Th>
              </Tr>
            </Thead>
            <Tbody>
              {inResults.map((result: InResult) => (
                <Tr key={result.athlete_id} paddingY="5px">
                  <Td>
                    {result.team}
                  </Td>
                  <Td>{result.athlete}</Td>
                  <Td>
                  <Input
                    placeholder="Enter Result"
                    size="md"
                    value={String(resultsVals[result.athlete_id] || "")}
                    onChange={(f) => handleInputChange(f, result.athlete_id)}
                  />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
        <Link to={"/competition/" + competitionId}>
          <Button onClick={handleSubmitResults} size="lg">Submit results</Button>
        </Link>
      </VStack>
    </>
  );
};

export default ResultsPage;

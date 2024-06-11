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
} from "@chakra-ui/react";
import InputResult from "../components/InputResult";
import { Result } from "../components/InputResult";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Athlete } from "../components/InputAthlete";
import axios from "axios";

const ResultsPage = () => {
  const [results, setResults] = useState<Result[]>([]);
  const [atheletesColl, setAthletes] = useState<Athlete[]>([]);
  const [competitionName, setCompetitionName] = useState("");
  const [eventName, setEventName] = useState("");
  const { competitionId, eventId } = useParams();

  const handleAddResult = (newResult: Result) => {
    setResults([...results, newResult]);
  };

  useEffect(() => {
    axios
      .get(backend + "/athletes/")
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
              {atheletesColl.map((athlete) => (
                <Tr key={athlete.id} paddingY="5px">
                  <Td>{athlete.team}</Td>
                  <Td>{athlete.name}</Td>
                  <Td>
                    <InputResult
                      onAdd={handleAddResult}
                      athlete={athlete.id}
                      event={Number(eventId)}
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
        <Link to={"/competition/" + competitionId}>
          <Button size="lg">Submit</Button>
        </Link>
      </VStack>
    </>
  );
};

export default ResultsPage;

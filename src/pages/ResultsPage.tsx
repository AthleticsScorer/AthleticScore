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
import axios from "axios";
import { Team } from "./CreatePage";
import { Athlete } from "../components/InputAthlete";

const ResultsPage = () => {
  const [results, setResults] = useState<Result[]>([]);
  const [atheletesColl, setAthletes] = useState<Athlete[]>([]);
  const [competitionName, setCompetitionName] = useState("");
  const [eventName, setEventName] = useState("");
  const [teams, setTeams] = useState<Team[]>([]);
  const { competitionId, eventId } = useParams();

  const handleAddResult = (newResult: Result) => {
    setResults([...results, newResult]);
  };

  useEffect(() => {
    axios
      .get(backend + "/events/" + eventId + "/all_teams")
      .then((response) => {
        setTeams(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  useEffect(() => {
    axios
      .get(backend + "/events/" + eventId + "/all_athletes")
      .then((response) => {
        setAthletes(response.data);
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
              {atheletesColl.map((athlete: Athlete) => (
                <Tr key={athlete.id} paddingY="5px">
                  <Td>
                    {
                      teams.find((t) => t.id === Number(athlete.team))
                        ?.short_code
                    }
                  </Td>
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

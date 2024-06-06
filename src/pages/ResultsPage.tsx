import {
  Button,
  Heading,
  HStack,
  List,
  ListItem,
  Text,
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

  return (
    <>
      <VStack>
        <Heading>{competitionName}</Heading>
        <List>
          {atheletesColl.map((athlete) => (
            <ListItem key={athlete.id} paddingY="5px">
              <HStack>
                <Text size={"lg"}>{athlete.name}</Text>
                <InputResult
                  onAdd={handleAddResult}
                  athlete={athlete.id}
                  event={Number(eventId)}
                />
              </HStack>
            </ListItem>
          ))}
        </List>
        <Link to={"/competition/" + competitionId + "/" + eventId + "/view"}>
          <Button size="lg">Submit</Button>
        </Link>
      </VStack>
    </>
  );
};

export default ResultsPage;

import { Heading, HStack, List, ListItem, Text, VStack } from "@chakra-ui/react"
import { Result } from "../components/InputResult"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"

interface DisplayResult {
    id: number,
    athleteName: String,
    value: number
}


const ViewPage = () => {

  const [results, setResults] = useState<Result[]>([])
  const { competitionId, eventId } = useParams();
  const [competitionName, setCompetitionName] = useState("")
  const [eventName, setEventName] = useState("")
  const [displayResults, setDisplayResults] = useState<DisplayResult[]>([])

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/results/')
      .then(response => {
        setResults(response.data);
        console.log(response.data)
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);


  useEffect(() => {
    const fetchAthleteNames = async () => {
      const filteredResults = results.filter(r => r.event === Number(eventId));
      const displayResultsPromises = filteredResults.map(async (result) => {
        try {
          const response = await axios.get(`http://127.0.0.1:8000/api/athletes/${result.athlete}`);
          const athleteName = response.data.name;
          return { id: result.id, athleteName: athleteName, value: Number(result.value) };
        } catch (error) {
          console.error("Error fetching athlete data:", error);
          return { id: result.id, athleteName: "Unknown Athlete", value: Number(result.value) };
        }
      });

      const resolvedDisplayResults = await Promise.all(displayResultsPromises);
      setDisplayResults(resolvedDisplayResults);
    };

    if (results.length > 0) {
      fetchAthleteNames();
    }
  }, [results]);

  useEffect(() => {
    const fetchCompetitionName = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/competitions/${competitionId}`);
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
        const response = await axios.get(`http://127.0.0.1:8000/api/events/${eventId}`);
        setEventName(response.data.age_group);
      } catch (error) {
        console.error("Error fetching competition data:", error);
        setEventName("Unknown Competition");
      }
    };

    fetchEventName();
  }, [eventId]);

  return (
    <>
    <VStack>
    <Heading>{competitionName + " " + eventName}</Heading>
    <List>
        {displayResults.map((result) => (
          <ListItem key={result.id} paddingY="5px">
            <HStack>
                <Text size={"lg"}>{result.athleteName}</Text>        
                <Text size={"lg"}>{result.value}</Text>
            </HStack>
          </ListItem>
        ))}
      </List>
    </VStack>
    </>
  )
}

export default ViewPage
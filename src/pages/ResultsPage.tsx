import { Button, HStack, List, ListItem, Text, VStack } from "@chakra-ui/react"
import InputResult from "../components/InputResult"
import { Result } from "../components/InputResult"
import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { Athlete } from "../components/InputAthlete"
import axios from "axios"


const ResultsPage = () => {

  const [results, setResults] = useState<Result[]>([])
  const [atheletesColl, setAthletes] = useState<Athlete[]>([]);
  const { competitionId, eventId } = useParams();

  const handleAddResult = (newResult: Result) => {
    setResults([...results, newResult]);
  };

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/athletes/')
      .then(response => {
        setAthletes(response.data);
        console.log(response.data)
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);


  return (
    <>
    <VStack>
    <List>
        {atheletesColl.map((athlete) => (
          <ListItem key={athlete.id} paddingY="5px">
            <HStack>
                <Text size={"lg"}>{athlete.name}</Text>
            <InputResult onAdd={handleAddResult} athlete={athlete.id} event={Number(eventId)}/>
            </HStack>
          </ListItem>
        ))}
      </List>
      <Link to={"/competition/" + competitionId + "/" + eventId + "/view"}>
        <Button size="lg">Submit</Button>
        </Link>
    </VStack>
    </>
  )
}

export default ResultsPage
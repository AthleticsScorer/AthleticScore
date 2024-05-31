import { Heading, HStack, List, ListItem, Text, VStack } from "@chakra-ui/react"
import { Result } from "../components/InputResult"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"


const ViewPage = () => {

  const [results, setResults] = useState<Result[]>([])
  const { competitionId, eventId } = useParams();

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


  return (
    <>
    <VStack>
    <Heading>{competitionId + " " + eventId}</Heading>
    <List>
        {results.map((result) => (
          <ListItem key={result.id} paddingY="5px">
            <HStack>
                <Text size={"lg"}>{result.athlete}</Text>        
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
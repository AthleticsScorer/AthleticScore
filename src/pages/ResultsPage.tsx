import { HStack, List, ListItem, Text, VStack } from "@chakra-ui/react"
import InputResult from "../components/InputResult"
import { Result } from "../components/InputResult"
import { useState } from "react"
import { useParams } from "react-router-dom"


const ResultsPage = () => {

  const athletes = [{id: 123, name: "Teo", organisation: "none"}, {id: 124, name: "Alex", organisation: "none"}]

  const [results, setResults] = useState<Result[]>([])
  const { eventName } = useParams();

  const handleAddResult = (newResult: Result) => {
    setResults([...results, newResult]);
  };

  return (
    <>
    <VStack>
    <List>
        {athletes.map((athlete) => (
          <ListItem key={athlete.id} paddingY="5px">
            <HStack>
                <Text size={"lg"}>{athlete.name}</Text>
            <InputResult onAdd={handleAddResult} athlete={athlete.name} event={eventName!}/>
            </HStack>
          </ListItem>
        ))}
      </List>
    </VStack>
    </>
  )
}

export default ResultsPage
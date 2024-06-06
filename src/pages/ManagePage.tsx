import { Center, VStack, Button, Text } from "@chakra-ui/react"
import CreateCompetition from "../components/CreateCompetition"


const ManagePage = () => {
  return (
    <Center height={"100vh"}>
        <VStack spacing={10}>
        <CreateCompetition />
        <Button colorScheme="blue"
        size="lg"
        type="submit">
            <Text>Your Competitions</Text>
        </Button>
        </VStack>
    </Center>
  )
}

export default ManagePage
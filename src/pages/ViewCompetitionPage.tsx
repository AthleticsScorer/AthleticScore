import { Center, Heading, VStack, Box } from "@chakra-ui/react";
import CreatedCompetitionsContainer from "../components/CreatedCompetitionsContainer";

const ViewCompetitionPage = () => {
  return (
    <Box minHeight={"80vh"}>
      <VStack>
      <Heading size="xl" paddingLeft={10}>
        Existing Competitions
      </Heading>
      <Center>
        <CreatedCompetitionsContainer />
      </Center>
      </VStack>
    </Box>
  );
};

export default ViewCompetitionPage;

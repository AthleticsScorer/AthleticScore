import { Center, Heading } from "@chakra-ui/react";
import CreatedCompetitionsContainer from "../components/CreatedCompetitionsContainer";

const ViewCompetitionPage = () => {
  return (
    <>
      <Heading size="xl" paddingLeft={10}>
        Existing Competitions
      </Heading>
      <Center>
        <CreatedCompetitionsContainer />
      </Center>
    </>
  );
};

export default ViewCompetitionPage;

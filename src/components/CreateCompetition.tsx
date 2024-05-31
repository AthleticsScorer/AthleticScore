import { Button, Input, VStack } from "@chakra-ui/react";
import { useState } from "react";
import { Link } from "react-router-dom";

function CreateCompetition() {
  const [competitionName, setCompetitionName] = useState("");

  return (
      <VStack>
        <Input
          placeholder="Competition Name"
          value={competitionName}
          onChange={(e) => setCompetitionName(e.target.value)}
        />
        <Link to={"/create/"+competitionName}>
        <Button colorScheme="blue" size="lg" type="submit">
          Create Competition
        </Button></Link>
      </VStack>
  );
}

export default CreateCompetition;

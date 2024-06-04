import { Button, Input, VStack } from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function CreateCompetition() {
  const [competitionName, setCompetitionName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAddClick = async () => {
    setLoading(true);
    try {
      const response = await axios.post(backend + '/competitions/', {
        name: competitionName,
      });
      navigate(`/create/${response.data.id}`);
    } catch (error) {
      console.error('Error creating competition:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <VStack>
      <Input
        placeholder="Competition Name"
        value={competitionName}
        onChange={(e) => setCompetitionName(e.target.value)}
      />
      <Button
        colorScheme="blue"
        size="lg"
        type="submit"
        onClick={handleAddClick}
        isLoading={loading}
      >
        Create Competition
      </Button>
    </VStack>
  );
}

export default CreateCompetition;

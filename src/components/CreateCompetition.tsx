import { Button, HStack, Input, VStack } from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { CiCirclePlus } from "react-icons/ci";
import { useNavigate } from "react-router-dom";

function CreateCompetition() {
  const [competitionName, setCompetitionName] = useState("");
  const [showInput, setShowInput] = useState(false);
  const navigate = useNavigate();

  const handleAddClick = () => {
    setShowInput(true);
  };

  const handlePostClick = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/competitions/", {
        name: competitionName,
        date: "2000-01-01"
      });
      navigate(`/create/${response.data.id}`);
    } catch (error) {
      console.error('Error creating competition:', error);
    } finally {
      setShowInput(false);
    }
  };

  return (
    <VStack>
      {!showInput ? (
        <Button
          colorScheme="blue"
          size="lg"
          type="button"
          onClick={handleAddClick}
        >
          Create New Competition
        </Button>
      ) : (
        <HStack>
          <Input
            placeholder="Enter Competition Name"
            value={competitionName}
            onChange={(e) => setCompetitionName(e.target.value)}
          />
          <CiCirclePlus onClick={handlePostClick} size={40} color="green"/>
        </HStack>
      )}
    </VStack>
  );
}

export default CreateCompetition;

import { Heading, HStack, IconButton, Input } from "@chakra-ui/react";
import { useState } from "react";
import { FaCirclePlus } from "react-icons/fa6";
import { Team } from "../pages/CreatePage";
import axios from "axios";
import { Link } from "react-router-dom";

interface Props {
  onAdd: (newTeam: Team) => void;
  competitionId: number;
}

const InputTeam = ({ onAdd, competitionId }: Props) => {
  const [teamName, setTeamName] = useState("");
  const [teamId, setTeamId] = useState(0);
  const [buttonClicked, setButtonClicked] = useState(false);

  const handleAddClick = async () => {
    try {
      const response = await axios.post(backend + "/teams/", {
        name: teamName,
        competition: competitionId,
      });
      setTeamId(response.data.id);
      const newTeam: Team = {
        id: teamId,
        name: teamName,
        competition: competitionId,
      };
      onAdd(newTeam);
      setButtonClicked(true);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <HStack>
      {!buttonClicked ? (
        <>
          <Input
            placeholder="Enter Team..."
            size="md"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
          />
          <Input placeholder="Enter Short Code..." size="md" />
          <IconButton
            variant="outline"
            colorScheme="teal"
            aria-label="Add Team"
            fontSize="20px"
            icon={<FaCirclePlus />}
            onClick={handleAddClick}
          />
        </>
      ) : (
        <Link to={"/competition/" + competitionId + "/team"}>
          <Heading size="md">{teamName}</Heading>
        </Link>
      )}
    </HStack>
  );
};

export default InputTeam;

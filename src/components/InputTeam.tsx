import { Heading, HStack, IconButton, Input } from "@chakra-ui/react";
import { useState } from "react";
import { FaCirclePlus } from "react-icons/fa6";
import { Team } from "../pages/CreatePage";
import axios from "axios";
import { Link } from "react-router-dom";

interface Props {
  onAdd: (newTeam: Team) => void;
  competitionId: number;
  button: boolean;
  team_name: String;
}

const InputTeam = ({ onAdd, competitionId, button, team_name }: Props) => {
  const [teamName, setTeamName] = useState(String(team_name));
  const [shortCode, setShortCode] = useState("");
  const [teamId, setTeamId] = useState(0);
  const [buttonClicked, setButtonClicked] = useState(button);

  const handleAddClick = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/teams/", {
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
      setButtonClicked(button);
      if (!button) {
        setTeamName("");
        setShortCode("");
      }
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
          <Input
            placeholder="Enter Short Code..."
            size="md"
            value={shortCode}
            onChange={(e) => setShortCode(e.target.value)}
          />
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
          <Heading size="md">{teamName + " - " + shortCode}</Heading>
        </Link>
      )}
    </HStack>
  );
};

export default InputTeam;

import { HStack, IconButton, Input, Select } from "@chakra-ui/react";
import { useState, useRef, SetStateAction } from "react";
import { FaCirclePlus } from "react-icons/fa6";
import axios from "axios";
import { Team } from "../pages/CreatePage";

interface Props {
  onAdd: (newAthlete: Athlete) => void;
  competitionId: number;
  teams: Team[];
}

export interface Athlete {
  id: number;
  name: String;
  competition: number;
}

const InputAthlete = ({ onAdd, competitionId, teams }: Props) => {
  const [athleteName, setAthleteName] = useState("");
  const [team, setTeam] = useState("");
  const currentIdRef = useRef(0);

  const handleSelectChange = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    setTeam(event.target.value);
  };

  const handleAddClick = async () => {
    await axios
      .post(backend + "/athletes/", {
        name: athleteName,
        competition: competitionId,
        team: team,
      })
      .then()
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
    const newAthlete: Athlete = {
      id: currentIdRef.current++,
      name: athleteName,
      competition: competitionId,
    };
    onAdd(newAthlete);
    setAthleteName("");
  };

  return (
    <HStack>
      <Input
        placeholder="Add Athlete"
        size="md"
        value={athleteName}
        onChange={(e) => setAthleteName(e.target.value)}
      />
      <Select
        placeholder="Team"
        size="md"
        value={team}
        onChange={handleSelectChange}
      >
        {teams.map((team) => (
          <option key={team.id} value={team.id}>
            {team.name}
          </option>
        ))}
      </Select>
      <IconButton
        variant="outline"
        colorScheme="teal"
        aria-label="Call Sage"
        fontSize="20px"
        icon={<FaCirclePlus />}
        onClick={handleAddClick}
      />
    </HStack>
  );
};

export default InputAthlete;

import { HStack, IconButton, Input } from "@chakra-ui/react";
import { useState } from "react";
import { FaCirclePlus } from "react-icons/fa6";
import { Team } from "../pages/CreatePage";
import axios from "axios";

interface Props {
    onAdd: (newTeam: Team) => void;
    competitionId: number,
}

const InputTeam = ({ onAdd, competitionId }: Props) => {
    
    const [teamName, setTeamName] = useState('');
    const [teamId, setTeamId] = useState(0);


    const handleAddClick = async () => {
        await axios.post(backend + "/organisations/", {
        name: teamName,
        competition: competitionId
      })
      .then(response => setTeamId(response.data.id))
      .catch(error => {
        console.error('Error fetching data:', error);
      });
      const newTeam: Team = {
        id: teamId, 
        name: teamName,
        competition: competitionId
      };
      onAdd(newTeam);
      setTeamName(''); 
      };


  return (
    <HStack>
      <Input placeholder="Add Team" size="md" value={teamName}
        onChange={(e) => setTeamName(e.target.value)}/>
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

export default InputTeam;

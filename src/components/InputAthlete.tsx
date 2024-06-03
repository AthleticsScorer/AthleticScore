import { HStack, IconButton, Input } from "@chakra-ui/react";
import { useState, useRef } from "react";
import { FaCirclePlus } from "react-icons/fa6";
import axios from "axios";

interface Props {
    onAdd: (newAthlete: Athlete) => void;
    competitionId: number;
}

export interface Athlete {
    id: number
    name: String
    competition: number
}

const InputAthlete = ({ onAdd, competitionId }: Props) => {
    
    const [athleteName, setAthleteName] = useState('');
    const currentIdRef = useRef(0);

    const handleAddClick = async () => {
        await axios.post(backend + '/athletes/', {
        name: athleteName,
        competition: competitionId
      })
      .then()
      .catch(error => {
        console.error('Error fetching data:', error);
      });
      const newAthlete: Athlete = {
        id: currentIdRef.current++,
        name: athleteName,
        competition: competitionId
      };
      onAdd(newAthlete);
      setAthleteName(''); 
      };


  return (
    <HStack>
      <Input placeholder="Add Athlete" size="md" value={athleteName}
        onChange={(e) => setAthleteName(e.target.value)}/>
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

import { HStack, IconButton, Input } from "@chakra-ui/react";
import { useState, useRef } from "react";
import { FaCirclePlus } from "react-icons/fa6";
import axios from "axios";

interface Props {
    onAdd: (newResult: Result) => void;
    athlete: String;
    event: String;
}

export interface Result {
    id: number
    value: String
    athlete: String
    event: String
}

const InputResult = ({ onAdd, athlete, event }: Props) => {
    
    const [result, setResult] = useState('');
    const currentIdRef = useRef(0);

    const handleAddClick = async () => {
        await axios.post("http://127.0.0.1:8000/api/results/", {
        value: result,
        athlete: athlete,
        event: event
      })
      .then()
      .catch(error => {
        console.error('Error fetching data:', error);
      });
      const newResult: Result = {
        id: currentIdRef.current++,
        value: result,
        athlete: athlete,
        event: event
      };
      onAdd(newResult);
      setResult("")
      };


  return (
    <HStack>

      <Input placeholder="Add Result" size="md" value={result}
        onChange={(e) => setResult(e.target.value)}/>
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

export default InputResult;

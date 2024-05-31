import { HStack, IconButton, Input } from "@chakra-ui/react";
import { useState, useRef } from "react";
import { FaCirclePlus } from "react-icons/fa6";
import { Event } from "../pages/CreatePage";
import axios from "axios";

interface Props {
    onAdd: (newEvent: Event) => void;
}

const InputEvent = ({ onAdd }: Props) => {
    
    const [eventName, setEventName] = useState('');
    const currentIdRef = useRef(0);

    const handleAddClick = async () => {
        await axios.post("http://127.0.0.1:8000/api/events/", {
        age_group: eventName,
        event_type: "Time",
        competition: 1
      })
      .then()
      .catch(error => {
        console.error('Error fetching data:', error);
      });
      const newEvent: Event = {
        id: currentIdRef.current++, 
        name: eventName,
      };
      onAdd(newEvent);
      setEventName(''); 
      };


  return (
    <HStack>
      <Input placeholder="Add Event" size="md" value={eventName}
        onChange={(e) => setEventName(e.target.value)}/>
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

export default InputEvent;

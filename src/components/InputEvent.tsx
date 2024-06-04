import { HStack, IconButton, Input, Select } from "@chakra-ui/react";
import { useState, useRef, SetStateAction } from "react";
import { FaCirclePlus } from "react-icons/fa6";
import { Event } from "../pages/CreatePage";
import axios from "axios";

interface Props {
    onAdd: (newEvent: Event) => void;
    competitionId: number,
}

const InputEvent = ({ onAdd, competitionId }: Props) => {
    
    const [eventName, setEventName] = useState('');
    const [eventType, setEventType] = useState('')
    const currentIdRef = useRef(0);

    const handleSelectChange = (event: { target: { value: SetStateAction<string>; }; }) => {
      setEventType(event.target.value);
    };

    const handleAddClick = async () => {
        await axios.post("http://127.0.0.1:8000/api/events/", {
        age_group: eventName,
        event_type: eventType,
        competition: competitionId
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
      <Select placeholder='Event Type' size="md" value={eventType} onChange={handleSelectChange}>
        <option value='Time'>Time</option>
        <option value='Distance'>Distance</option>
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

export default InputEvent;

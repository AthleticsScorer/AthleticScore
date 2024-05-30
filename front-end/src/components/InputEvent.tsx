import { HStack, IconButton, Input } from "@chakra-ui/react";
import { useState, useRef } from "react";
import { FaCirclePlus } from "react-icons/fa6";
import { Event } from "../pages/CreatePage";

interface Props {
    onAdd: (newEvent: Event) => void;
}

const InputEvent = ({ onAdd }: Props) => {
    
    const [eventName, setEventName] = useState('');
    const currentIdRef = useRef(0);

    const handleAddClick = () => {
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

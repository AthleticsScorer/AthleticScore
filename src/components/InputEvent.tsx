import { Heading, HStack, IconButton, Input, Select } from "@chakra-ui/react";
import { useState, useRef, SetStateAction } from "react";
import { FaCirclePlus } from "react-icons/fa6";
import { Event } from "../pages/CreatePage";
import axios from "axios";
import { Link } from "react-router-dom";

interface Props {
  onAdd: (newEvent: Event) => void;
  competitionId: number;
  button: boolean;
  event_name: String;
  age_group: String;
}

const InputEvent = ({
  onAdd,
  competitionId,
  button,
  event_name,
  age_group,
}: Props) => {
  const [eventName, setEventName] = useState(String(event_name));
  const [ageGroup, setAgeGroup] = useState(String(age_group));
  const [eventId, setEventId] = useState(0);
  const [eventType, setEventType] = useState("");
  const [buttonClicked, setButtonClicked] = useState(button);
  const currentIdRef = useRef(0);

  const handleSelectChange = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    setEventType(event.target.value);
  };

  const handleAddClick = async () => {
    await axios
      .post(backend + "/events/", {
        event_name: eventName,
        age_group: ageGroup,
        event_type: eventType,
        competition: competitionId,
      })
      .then((response) => setEventId(response.data.id))
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
    const newEvent: Event = {
      id: currentIdRef.current++,
      event_name: eventName,
      competition: competitionId,
      age_group: ageGroup,
      event_type: eventType,
    };
    onAdd(newEvent);
    setButtonClicked(button);
    if (!button) {
      setEventName("");
      setAgeGroup("");
      setEventType("");
    }
  };

  return (
    <HStack>
      {!buttonClicked ? (
        <>
          <Input
            placeholder="Enter Event Name..."
            size="md"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
          />
          <Input
            placeholder="Enter Age Group"
            size="md"
            value={ageGroup}
            onChange={(e) => setAgeGroup(e.target.value)}
          />
          <Select
            placeholder="Event Type"
            size="md"
            value={eventType}
            onChange={handleSelectChange}
          >
            <option value="Time">Time</option>
            <option value="Distance">Distance</option>
          </Select>
          <IconButton
            variant="outline"
            colorScheme="teal"
            aria-label="Call Sage"
            fontSize="20px"
            icon={<FaCirclePlus />}
            onClick={handleAddClick}
          />
        </>
      ) : (
        <>
          <Link to={"/competition/" + competitionId + "/" + eventId}>
            <HStack>
              <Heading size="md">{eventName}</Heading>
              <Heading size="md">{ageGroup}</Heading>
            </HStack>
          </Link>

          <Select placeholder={"..."} size="md">
            <option>Edit</option>
            <option>Delete</option>
          </Select>
        </>
      )}
    </HStack>
  );
};

export default InputEvent;

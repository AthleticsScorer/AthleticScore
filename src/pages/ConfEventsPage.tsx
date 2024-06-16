import {
  Button,
  Heading,
  VStack,
  HStack,
  Input,
  Center,
  IconButton,
} from "@chakra-ui/react";
import { useParams, Link } from "react-router-dom";
import { FaCirclePlus } from "react-icons/fa6";
import { useEffect, useRef, useState } from "react";
import { Event } from "../pages/CreatePage";
import axios from "axios";
import CheckBox from "../components/CheckBox";

interface EventBox {
  id: number;
  value: String;
  isChecked: boolean;
}

export interface ListElem {
  id: number;
  value: String;
}

const ConfEventsPage = () => {
  const [eventBoxes, setEventBoxes] = useState<EventBox[]>([
    { id: 0, value: "Hurdles", isChecked: true },
    { id: 1, value: "100m", isChecked: true },
    { id: 2, value: "200m", isChecked: true },
    { id: 3, value: "400m", isChecked: true },
    { id: 4, value: "800m", isChecked: true },
    { id: 5, value: "1500m", isChecked: true },
    { id: 6, value: "Shot Put", isChecked: true },
    { id: 7, value: "Discus", isChecked: true },
    { id: 8, value: "Javelin", isChecked: true },
    { id: 9, value: "High Jump", isChecked: true },
    { id: 10, value: "Long Jump", isChecked: true },
    { id: 11, value: "Triple Jump", isChecked: true },
  ]);
  const eventStringId = useRef(0);
  const eventAgeId = useRef(0);
  const [eventString, setEventString] = useState<String>("");
  const [eventStrings, setEventStrings] = useState<ListElem[]>([]);
  const [eventAge, setEventAge] = useState<String>("");
  const [eventAges, setEventAges] = useState<ListElem[]>([]);
  const { competitionId } = useParams();

  const submitAllEvents = async () => {
    try {
      await axios.post(backend + `/bulk_create/events/${competitionId}/`, {
        event_types: eventBoxes
          .filter((eb) => eb.isChecked === true)
          .map((eb) => eb.value),
        age_groups: eventAges.map((e) => e.value),
        names: eventStrings.map((e) => e.value),
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (competitionId) {
      axios
        .get(backend + `/events/`)
        .then((response) => {
          const filteredEvents = response.data.filter(
            (e: Event) => e.competition === Number(competitionId)
          );
          const eventTypes = Array.from(
            new Set(filteredEvents.map((e: Event) => e.event_type))
          );
          setEventAges(
            filteredEvents
              .map((e: Event) => ({
                id: e.id,
                value: e.age_group,
              }))
              .filter(
                (elem: ListElem, index: number, self: ListElem[]) =>
                  index ===
                  self.findIndex((o: ListElem) => o.value === elem.value)
              )
          );
          setEventStrings(
            filteredEvents
              .map((e: Event) => ({
                id: e.id,
                value: e.event_name,
              }))
              .filter(
                (elem: ListElem, index: number, self: ListElem[]) =>
                  index ===
                  self.findIndex((o: ListElem) => o.value === elem.value)
              )
          );
          setEventBoxes(
            eventBoxes.map((eb) => ({
              id: eb.id,
              value: eb.value,
              isChecked:
                eventTypes.length === 0 || eventTypes.includes(eb.value),
            }))
          );
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  }, [competitionId]);

  function changeChecked(
    event: EventBox,
    currentTarget: HTMLInputElement
  ): EventBox {
    if (event.value === currentTarget.value) {
      event.isChecked = currentTarget.checked;
    }
    return event;
  }

  function handleCheckChildElement(action: React.FormEvent<HTMLInputElement>) {
    const currentTarget = action.currentTarget;
    setEventBoxes((eventBoxes) =>
      eventBoxes.map((event) =>
        event.value === currentTarget.value
          ? changeChecked(event, currentTarget)
          : event
      )
    );
  }

  function handleAddStringClick() {
    if (eventString != "") {
      setEventStrings([
        ...eventStrings,
        { id: eventStringId.current++, value: eventString },
      ]);
      setEventString("");
    }
  }

  function handleAddAgeClick() {
    if (eventAge != "") {
      setEventAges([
        ...eventAges,
        { id: eventAgeId.current++, value: eventAge },
      ]);
      setEventAge("");
    }
  }

  return (
    <VStack padding="10px">
      <Heading>{"Configure Events"}</Heading>
      <HStack>
        <VStack padding="100px">
          <Heading>{"Events"}</Heading>
          <ul style={{ listStyle: "none" }}>
            {eventBoxes.map((event) => {
              return (
                <CheckBox
                  handleCheckChildElement={handleCheckChildElement}
                  key={event.id}
                  value={event.value}
                  isChecked={event.isChecked}
                />
              );
            })}
          </ul>
        </VStack>
        <VStack padding="40px">
          <Heading>{"Strings"}</Heading>
          {eventStrings.map((s) => (
            <Center key={s.id} minW="200px" bg="blue.600" color="white">
              {s.value}
            </Center>
          ))}
          <HStack padding="10px">
            <Input
              placeholder="Enter String Name..."
              size="md"
              value={String(eventString)}
              onChange={(e) => setEventString(e.target.value)}
            />
            <IconButton
              variant="outline"
              colorScheme="teal"
              aria-label="Call Sage"
              fontSize="20px"
              icon={<FaCirclePlus />}
              onClick={handleAddStringClick}
            />
          </HStack>
        </VStack>
        <VStack padding="10px">
          <Heading>{"Age Groups"}</Heading>
          {eventAges.map((s) => (
            <Center key={s.id} minW="200px" bg="blue.600" color="white">
              {s.value}
            </Center>
          ))}
          <HStack padding="10px">
            <Input
              placeholder="Enter Age Group Name..."
              size="md"
              value={String(eventAge)}
              onChange={(e) => setEventAge(e.target.value)}
            />
            <IconButton
              variant="outline"
              colorScheme="teal"
              aria-label="Call Sage"
              fontSize="20px"
              icon={<FaCirclePlus />}
              onClick={handleAddAgeClick}
            />
          </HStack>
        </VStack>
      </HStack>
      <Link to={"/create/" + competitionId + "/teams"}>
        <Button
          colorScheme="blue"
          size="lg"
          type="button"
          onClick={submitAllEvents}
        >
          Confirm
        </Button>
      </Link>
    </VStack>
  );
};

export default ConfEventsPage;

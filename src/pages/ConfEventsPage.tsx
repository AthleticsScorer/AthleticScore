import { Button, Heading, VStack, HStack, Input, Center, IconButton } from "@chakra-ui/react";
import { useParams, Link } from "react-router-dom";
import { FaCirclePlus } from "react-icons/fa6";
import { useState } from "react";
import axios from "axios";
import CheckBox from "../components/CheckBox";

interface EventBox {
    id: number;
    value: string;
    isChecked: boolean;
}

const ConfEventsPage = () => {
    const [eventBoxes, setEventBoxes] = useState<EventBox[]> (
        [
            {id: 0, value: "Hurdles", isChecked: true},
            {id: 1, value: "100m", isChecked: true},
            {id: 2, value: "200m", isChecked: true},
            {id: 3, value: "400m", isChecked: true},
            {id: 4, value: "800m", isChecked: true},
            {id: 5, value: "1500m", isChecked: true},
            {id: 6, value: "Shot Put", isChecked: true},
            {id: 7, value: "Discus", isChecked: true},
            {id: 8, value: "Javelin", isChecked: true},
            {id: 9, value: "High Jump", isChecked: true},
            {id: 10, value: "Long Jump", isChecked: true},
            {id: 11, value: "Triple Jump", isChecked: true}
        ]
    );
    const [eventString, setEventString] = useState<string>("")
    const [eventStrings, setEventStrings] = useState<string[]>([])
    const [eventAge, setEventAge] = useState<string>("")
    const [eventAges, setEventAges] = useState<string[]>([])
    const {competitionId} = useParams();

    const submitAllEvents = async () => {
        try {
            const response = await axios.post(backend + `/bulk_create/events/${competitionId}/`, {
                event_types: eventBoxes.filter(eb => eb.isChecked === true).map(eb => eb.value),
                age_groups: eventAges,
                names: eventStrings
            })
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    function changeChecked(event: EventBox, currentTarget: HTMLInputElement): EventBox{
        if (event.value === currentTarget.value) {
            event.isChecked = currentTarget.checked;
          }
        return event;
    };

    function handleCheckChildElement(action: React.FormEvent<HTMLInputElement>) {
        const currentTarget = action.currentTarget;
        setEventBoxes(eventBoxes => eventBoxes.map(
            event => event.value === currentTarget.value ?
            changeChecked(event, currentTarget) : event
        ))
      };

    function handleAddStringClick(action: any) {
        if (eventString != "") {
            setEventStrings([...eventStrings, eventString]);
            setEventString("");
        }
    }

    function handleAddAgeClick(action: any) {
        if (eventAge != "") {
            setEventAges([...eventAges, eventAge]);
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
                    {eventBoxes.map(event => {
                            return (
                            <CheckBox
                                handleCheckChildElement={handleCheckChildElement}
                                id={event.id}
                                value={event.value}
                                isChecked={event.isChecked}
                            />
                            );
                        })}
                    </ul>
                </VStack>
                <VStack padding="40px">
                    <Heading>{"Strings"}</Heading>
                    {eventStrings.map(s => (
                        <Center minW='200px' bg='blue.600' color='white'>
                        {s}
                        </Center>
                    ))}
                    <HStack padding="10px">
                        <Input
                            placeholder="Enter String Name..."
                            size="md"
                            value={eventString}
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
                    {eventAges.map(s => (
                        <Center minW='200px' bg='blue.600' color='white'>
                        {s}
                        </Center>
                    ))}
                    <HStack padding="10px">
                        <Input
                            placeholder="Enter Age Group Name..."
                            size="md"
                            value={eventAge}
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
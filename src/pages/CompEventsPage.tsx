import { Button, Heading, VStack, HStack, Input, Center, IconButton } from "@chakra-ui/react";
import { Link, useParams } from "react-router-dom";
import { FaCirclePlus } from "react-icons/fa6";
import { useEffect, useState } from "react";
import axios from "axios";
import CheckBox from "../components/CheckBox";

interface EventBox {
    id: number;
    value: string;
    isChecked: boolean;
}

interface EventsBoxes {
    eventBoxes: EventBox[];
}

interface EventString {
    eventString: string
}

interface EventStrings {
    eventStrings: string[];
}

interface EventAge {
    eventAge: string
}

interface EventAges {
    eventAges: string[];
}

const CompEventsPage = () => {
    const [eventBoxes, setEventBoxes] = useState<EventBox[]> (
        [
            {id: 0, value: "Hurdles", isChecked: false},
            {id: 1, value: "100m", isChecked: false},
            {id: 2, value: "200m", isChecked: false},
            {id: 3, value: "400m", isChecked: false},
            {id: 4, value: "800m", isChecked: false},
            {id: 5, value: "1500m", isChecked: false},
            {id: 6, value: "Shot Put", isChecked: false},
            {id: 7, value: "Discus", isChecked: false},
            {id: 8, value: "Javelin", isChecked: false},
            {id: 9, value: "High Jump", isChecked: false},
            {id: 10, value: "Long Jump", isChecked: false},
            {id: 11, value: "Triple Jump", isChecked: false}
        ]
    );
    const [eventString, setEventString] = useState<string>("")
    const [eventStrings, setEventStrings] = useState<string[]>([])
    const [eventAge, setEventAge] = useState<string>("")
    const [eventAges, setEventAges] = useState<string[]>([])

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
            
        </VStack>

    );
};

export default CompEventsPage;
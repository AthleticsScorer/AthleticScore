import { Button, Heading, VStack } from "@chakra-ui/react";
import { Link, useParams } from "react-router-dom";
import InputAthlete from "../components/InputAthlete";
import { Athlete } from "../components/InputAthlete";
import { useEffect, useState } from "react";
import CreatedAthletesContainer from "../components/CreatedAthletesContainer";
import axios from "axios";
import { Team } from "./CreatePage";

interface EventBox {
    id: number;
    value: string;
    isChecked: boolean;
}

interface EventsBoxes {
    eventBoxes: EventBox[];
}

const CompEventsPage () => {
    const [events, setEvents]
}
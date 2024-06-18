import {
  Button,
  Heading,
  VStack,
  HStack,
  Input,
  Box,
  IconButton,
  Center
} from "@chakra-ui/react";
import { Params, useNavigate, useParams } from "react-router-dom";
import { FaCirclePlus } from "react-icons/fa6";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

interface Team {
  id: number;
  name: String;
  short_code: String;
}

const ConfTeamsPage = () => {
  const [teamName, setTeamName] = useState<String>("");
  const [teamCode, setTeamCode] = useState<String>("");
  const [teams, setTeams] = useState<Team[]>([]);
  const { competitionId } = useParams<Params>();
  const teamId = useRef(0);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(backend + "/competitions/" + competitionId + "/all_teams")
      .then((response) => {
        setTeams(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [competitionId]);

  const submitAllTeams = async () => {
    try {
      await axios.post(backend + `/bulk_create/teams/${competitionId}/`, {
        teams: teams,
      });

      navigate(`/create/${competitionId}/viewteams`);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  function handleAddTeamClick() {
    if (teamName != "" && teamCode != "")
      setTeams([
        ...teams,
        { id: teamId.current++, name: teamName, short_code: teamCode },
      ]);
    setTeamName("");
    setTeamCode("");
  }

  return (
    <Box minHeight={"80vh"}>
    <VStack padding="10px">
      <Heading>{"Configure Teams"}</Heading>
      {teams.map((t) => (
        <Center key={t.id} minW="200px" bg="blue.600" color="white">
          {t.name + " " + t.short_code}
        </Center>
      ))}
      <HStack padding="40px">
        <Input
          placeholder="Enter Team Name..."
          size="md"
          value={String(teamName)}
          onChange={(e) => setTeamName(e.target.value)}
        />
        <Input
          placeholder="Enter Team Code..."
          size="md"
          value={String(teamCode)}
          onChange={(e) => setTeamCode(e.target.value)}
          maxLength={3}
        />
        <IconButton
          variant="outline"
          colorScheme="teal"
          aria-label="Call Sage"
          fontSize="20px"
          icon={<FaCirclePlus />}
          onClick={handleAddTeamClick}
        />
      </HStack>
      <Button
        colorScheme="blue"
        size="lg"
        type="button"
        onClick={submitAllTeams}
      >
        Confirm
      </Button>
    </VStack>
    </Box>
  );
};

export default ConfTeamsPage;

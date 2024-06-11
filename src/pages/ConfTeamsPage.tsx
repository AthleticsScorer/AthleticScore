import {
  Button,
  Heading,
  VStack,
  HStack,
  Input,
  Center,
  IconButton,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { FaCirclePlus } from "react-icons/fa6";
import { useRef, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

interface Team {
  id: number;
  name: string;
  short_code: string;
}

const ConfTeamsPage = () => {
  const [teamName, setTeamName] = useState<string>("");
  const [teamCode, setTeamCode] = useState<string>("");
  const [teams, setTeams] = useState<Team[]>([]);
  const { competitionId } = useParams();
  const teamId = useRef(0);

  const submitAllTeams = async () => {
    try {
      console.log(teams);
      await axios.post(backend + `/bulk_create/teams/${competitionId}/`, {
        teams: teams,
      });
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
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
        />
        <Input
          placeholder="Enter Team Code..."
          size="md"
          value={teamCode}
          onChange={(e) => setTeamCode(e.target.value)}
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
      <Link to={"/create/" + competitionId + "/viewteams"}>
        <Button
          colorScheme="blue"
          size="lg"
          type="button"
          onClick={submitAllTeams}
        >
          Confirm
        </Button>
      </Link>
    </VStack>
  );
};

export default ConfTeamsPage;

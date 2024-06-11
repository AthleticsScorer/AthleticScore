import { Select, VStack } from "@chakra-ui/react";
import axios from "axios";
import { useState, useEffect, SetStateAction } from "react";
import { Team } from "./CreatePage";
import { useParams, Link } from "react-router-dom";
import InputTeamAthletes from "../components/InputTeamAthletes";

const TeamPage = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [team, setTeam] = useState("");
  const competitionId = useParams();

  const handleSelectChange = (event: {
    target: { value: SetStateAction<String> };
  }) => {
    setTeam(String(event.target.value));
  };

  useEffect(() => {
    axios
      .get(backend + "/teams/")
      .then((response) => {
        const filteredTeams = response.data.filter(
          (e: Team) => e.competition === Number(competitionId!.competitionId)
        );
        setTeams(filteredTeams);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <VStack spacing={10}>
      <Select
        placeholder="Team"
        size="md"
        value={team}
        onChange={handleSelectChange}
      >
        {teams.map((team) => (
          <option key={team.id} value={team.id}>
            {team.name}
          </option>
        ))}
      </Select>
      <InputTeamAthletes teamId={Number(team)} />
    </VStack>
  );
};

export default TeamPage;

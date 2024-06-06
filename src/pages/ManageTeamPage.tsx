import { Button, Heading, HStack, VStack } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { Params, useParams } from "react-router-dom";
import InputTeam from "../components/InputTeam";
import { Team } from "./CreatePage";

const ManageTeamPage = () => {
  const competitionId = useParams<Params>();
  const [competitionName, setCompetitionName] = useState("");
  const [teams, setTeams] = useState<Team[]>([]);

  const handleAddTeam = (newTeam: Team) => {
    setTeams([...teams, newTeam]);
  };

  useEffect(() => {
    const fetchCompetitionName = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api" +
            `/competitions/${competitionId.competitionId}`
        );
        setCompetitionName(response.data.name);
      } catch (error) {
        console.error("Error fetching competition data:", error);
        setCompetitionName("Unknown Competition");
      }
    };

    fetchCompetitionName();
  }, [competitionId]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api" + "/teams/")
      .then((response) => {
        const filteredTeams = response.data.filter(
          (e: Team) => e.competition === Number(competitionId.competitionId)
        );
        setTeams(filteredTeams);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <VStack spacing={5}>
      <HStack spacing={10}>
        <Heading>{competitionName}</Heading>
        <Button colorScheme="blue" size="lg">
          Import Team
        </Button>
      </HStack>
      {teams.map((team, index) => (
        <InputTeam
          key={index}
          onAdd={handleAddTeam}
          competitionId={Number(competitionId.competitionId)}
          button={true}
          team_name={team.name}
        />
      ))}
      <InputTeam
        onAdd={handleAddTeam}
        competitionId={Number(competitionId.competitionId)}
        button={false}
        team_name={""}
      />
    </VStack>
  );
};

export default ManageTeamPage;

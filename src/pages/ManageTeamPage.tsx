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
          backend +
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

  return (
    <VStack spacing={5}>
      <HStack spacing={10}>
        <Heading>{competitionName}</Heading>
        <Button colorScheme="blue" size="lg">
          Import Team
        </Button>
      </HStack>
      <InputTeam
        onAdd={handleAddTeam}
        competitionId={Number(competitionId.competitionId)}
      />
      {teams.map((_, index) => (
        <InputTeam
          key={index}
          onAdd={handleAddTeam}
          competitionId={Number(competitionId.competitionId)}
        />
      ))}
    </VStack>
  );
};

export default ManageTeamPage;

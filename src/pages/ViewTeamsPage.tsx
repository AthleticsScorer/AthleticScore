import { Heading, VStack, Button } from "@chakra-ui/react";
import axios from "axios";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

interface Team {
  id: number;
  name: String;
  short_code: String;
  competition: number;
}

const ViewTeamsPage = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const competitionId = useParams();

  useEffect(() => {
    if (competitionId) {
      axios
        .get(backend + "/teams/")
        .then((response) => {
          const filteredTeams = response.data.filter(
            (e: Team) => e.competition === Number(competitionId!.competitionId)
          );
          setTeams(filteredTeams);
          console.log(response.data);
          console.log(teams);
          console.log(filteredTeams);
          console.log('"');
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  }, [competitionId]);

  return (
    <VStack spacing="10px">
      <Heading>{"Manage Teams"}</Heading>
      {teams.map((team) => (
        <Link
          to={"/create/" + competitionId.competitionId + "/teams/" + team.id}
          key={team.id}
        >
          <Button colorScheme="blue" size="lg" type="button">
            {team.name}
          </Button>
        </Link>
      ))}
    </VStack>
  );
};

export default ViewTeamsPage;

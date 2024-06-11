import { Heading, VStack, Button } from "@chakra-ui/react";
import axios from "axios";
import { useState, useEffect, SetStateAction } from "react";
import { useParams, Link } from "react-router-dom";

interface Team {
    id: number,
    name: string,
    short_code: string
    competition: number
}

const ViewTeamsPage = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const competitionId = useParams();

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
        <VStack spacing="10px">
            <Heading>{"Manage Teams"}</Heading>
            {teams.map((team) => (
                <Link to={"/create/" + competitionId + "/teams/" + team.id}>
                <Button
                    colorScheme="blue"
                    size="lg"
                    type="button"
                    >
                    {team.name}
                </Button>
                </Link>
            ))}
        </VStack>
    )
}

export default ViewTeamsPage;

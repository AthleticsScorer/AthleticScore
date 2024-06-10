import { Button, Heading, VStack, HStack, Input, Center, IconButton } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { FaCirclePlus } from "react-icons/fa6";
import { useState } from "react";
import axios from "axios";

interface Team {
    name: string,
    code: string
}

const ConfTeamsPage = () => {
    const [team, setTeam] = useState<Team>({name: "", code: ""});
    const [teams, setTeams] = useState<Team[]>([]);
    const {competitionId} = useParams();

    const submitAllTeams = async () => {
        try {
            const response = await axios.post(backend + `/bulk_create_teams/${competitionId}/`, {
                name: teams
            })
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    function handleAddTeamClick(action: any) {
        if (team) {
            if (team.name != "" && team.code != "") 
                setTeams([...teams, team]);
                setTeam({name: "", code: ""});
            }
        }

    return (
        <VStack padding="10px">
            <Heading>{"Configure Teams"}</Heading>
            {teams.map(t => (
                <Center minW='200px' bg='blue.600' color='white'>
                {t.name + " " + t.code}
                </Center>
            ))}
            <HStack padding="40px">
                <Input
                    placeholder="Enter Team Name..."
                    size="md"
                    value={team.name}
                    onChange={(e) => setTeam(e.target.value)}
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
            <Button
                colorScheme="blue"
                size="lg"
                type="button"
                onClick={submitAllTeams}
                >
                Confirm
            </Button>
        </VStack>
    )
}

export default ConfTeamsPage;
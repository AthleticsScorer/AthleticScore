import { List, ListItem, HStack, Button, Select, Box } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { Competition } from "../pages/HomePage";
import { Link } from "react-router-dom";

const CreatedCompetitionsContainer = () => {
  const [competitions, setCompetitions] = useState<Competition[]>([]);

  useEffect(() => {
    const fetchCompetitionName = async () => {
      try {
        const response = await axios.get(backend + `/competitions/`);
        setCompetitions(response.data);
      } catch (error) {
        console.error("Error fetching competition data:", error);
        setCompetitions([]);
      }
    };

    fetchCompetitionName();
  }, []);

  return (
    <List>
      {competitions.map((competition) => (
        <ListItem key={competition.id} paddingY="5px">
          <Box
            background="darkviolet"
            borderWidth="1px"
            borderRadius="lg"
            p="3"
          >
            <HStack spacing={4}>
              <Link to={"/competition/" + competition.id}>
                <Button
                  whiteSpace="normal"
                  textAlign="left"
                  fontSize="xl"
                  variant="link"
                >
                  {competition.name}
                </Button>
              </Link>
              <Select placeholder={"..."} size="md">
                <option>Edit</option>
                <option>Delete</option>
              </Select>
            </HStack>
          </Box>
        </ListItem>
      ))}
    </List>
  );
};

export default CreatedCompetitionsContainer;

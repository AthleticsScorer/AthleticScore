import { List, ListItem, HStack, Button } from "@chakra-ui/react";
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
          <HStack>
            <Link to={"/competition/" + competition.id}>
              <Button
                whiteSpace="normal"
                textAlign="left"
                fontSize="lg"
                variant="link"
              >
                {competition.name}
              </Button>
            </Link>
          </HStack>
        </ListItem>
      ))}
    </List>
  );
};

export default CreatedCompetitionsContainer;

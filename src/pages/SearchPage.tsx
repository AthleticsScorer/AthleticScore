import {
  Box,
  Button,
  Heading,
  HStack,
  Input,
  Select,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Competition } from "./HomePage";
import axios from "axios";
import React from "react";
import { Link } from "react-router-dom";

const SearchPage = () => {
  const [searchValue, setSearchValue] = useState("");
  const [competitions, setCompetitions] = useState<Competition[]>([]);

  useEffect(() => {
    const fetchCompetitions = async () => {
      try {
        const response = await axios.get(
          backend + `/competitions/`
        );
        setCompetitions(response.data);
      } catch (error) {
        console.error("Error fetching competition data:", error);
        setCompetitions([]);
      }
    };

    fetchCompetitions();
  }, []);

  return (
    <VStack>
      <HStack>
        <Input
          placeholder="Search Name..."
          size={"lg"}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        ></Input>
        <Select placeholder="All Time" size="lg">
          <option value="Last Day">Last Day</option>
          <option value="Last Week">Last Week</option>
          <option value="Last Month">Last Month</option>
          <option value="Last Year">Last Year</option>
          <option value="All Time">All Time</option>
        </Select>
        <Button colorScheme="blue" size="lg">
          <Text>Search</Text>
        </Button>
      </HStack>
      <SimpleGrid columns={2} spacing={4}>
        <Box>
          <Heading size="md">Date</Heading>
        </Box>
        <Box>
          <Heading size="md">Name</Heading>
        </Box>
        {competitions.map((competition) => (
          <React.Fragment key={competition.id}>
            <Box>
              <Heading size="md">{competition.date}</Heading>
            </Box>
            <Box>
              <Link to={"/competition/" + competition.id + "/search"}>
                <Heading size="md">{competition.name}</Heading>
              </Link>
            </Box>
          </React.Fragment>
        ))}
      </SimpleGrid>
    </VStack>
  );
};

export default SearchPage;

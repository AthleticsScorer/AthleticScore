import {
  Button,
  HStack,
  Input,
  Select,
  Text,
  VStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Box
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
        const response = await axios.get(backend + `/competitions/`);
        setCompetitions(response.data);
      } catch (error) {
        console.error("Error fetching competition data:", error);
        setCompetitions([]);
      }
    };

    fetchCompetitions();
  }, []);

  const handleSearch = async () => {
    console.log("searching");
    try {
      const response = await axios.get(
        backend + `/competitions/filter/?competition_name=` + searchValue
      );
      setCompetitions(response.data);
    } catch (error) {
      console.error("Error fetching competition data:", error);
      setCompetitions([]);
    }
  };

  return (
    <Box minHeight={"80vh"}>
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
        <Button colorScheme="blue" size="lg" onClick={handleSearch}>
          <Text>Search</Text>
        </Button>
      </HStack>
      <TableContainer>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Date</Th>
                <Th>Name</Th>
              </Tr>
            </Thead>
            <Tbody>
              {competitions.map((competition) => (
              <Tr>
                <Td>{String(competition.date) === "null" ? "Ongoing" : String(competition.date)}</Td>
                <Td>
                  <Link to={"/competition/" + competition.id + "/search"}>
                  <Button
                    colorScheme="blue"
                    size="lg"
                    width='500px'
                    type="button">
                      
                {competition.name}
                </Button>
                </Link>
              </Td>
              </Tr> 
              ))}
            </Tbody>
          </Table>
        </TableContainer>
    </VStack>
    </Box>
  );
};

export default SearchPage;

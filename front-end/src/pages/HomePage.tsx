import { Center } from "@chakra-ui/react";
import CreateCompetition from "../components/CreateCompetition";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <Center height={"100vh"}>
      <Link to={"/create"}>
        <CreateCompetition />
      </Link>
    </Center>
  );
};

export default HomePage;

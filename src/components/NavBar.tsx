import { HStack, Heading } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { FaHome, FaRunning, FaSearch } from "react-icons/fa";

const NavBar = () => {
  return (
    <HStack spacing="40px" padding="20px" background="#ADD8E6" height="75px">
      <Heading>AthleticScore</Heading>
      <Link to="/">
        <FaHome size="50px" />
      </Link>
      <Link to="/manage">
        <FaRunning size="50px" />
      </Link>
      <Link to="/search">
        <FaSearch size="50px" />
      </Link>
    </HStack>
  );
};
//
export default NavBar;

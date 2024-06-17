import { HStack } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { FaHome, FaRunning, FaSearch } from "react-icons/fa";

const NavBar = () => {
  return (
    <HStack spacing={20} padding="10px" background="deepskyblue">
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

import { HStack } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { FaHome } from "react-icons/fa";

const NavBar = () => {
  return (
    <HStack padding="10px">
      <Link to="/">
        <FaHome size="50px" />
      </Link>
    </HStack>
  );
};

export default NavBar;
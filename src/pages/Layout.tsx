import { Box, HStack, Heading } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";

const Layout = () => {
  return (
    <>
      <NavBar />
      <Box padding={5}>
        <Outlet />
      </Box>
      <HStack alignItems="end" spacing={20} padding="10px" background="#ADD8E6" height="75px"></HStack>
    </>
  );
};

export default Layout;

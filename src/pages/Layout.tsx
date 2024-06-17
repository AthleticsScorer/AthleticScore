import { Box } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";

const Layout = () => {
  return (
    <>
      <NavBar />
      <Box padding={5}>
        <Outlet />
      </Box>
      <footer style={{height="100px" background="deepskyblue"}}>
        </footer>
    </>
  );
};

export default Layout;

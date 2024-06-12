import { List, ListItem, HStack, Button, Select, Box } from "@chakra-ui/react";
import { Event } from "../pages/CreatePage";
import { Link } from "react-router-dom";

interface Props {
  competitionId: number;
  events: Event[];
}

const EventsDisplayContainer = ({ competitionId, events }: Props) => {
  return (
    <List>
      {events.map((event) => (
        <ListItem key={event.id} paddingY="5px">
          <Box
            background={event.complete ? "green" : "darkblue"}
            borderWidth="1px"
            borderRadius="lg"
            p="3"
          >
            <HStack>
              <Link
                to={
                  "/competition/" + competitionId + "/" + event.id + "/results"
                }
              >
                <Button
                  whiteSpace="normal"
                  textAlign="left"
                  fontSize="lg"
                  variant="link"
                  color="white"
                >
                  {event.event_name +
                    " " +
                    event.age_group +
                    " " +
                    event.event_type}
                </Button>
              </Link>
              //<Select placeholder={"..."} size="md">
              //  <option>Edit</option>
              //  <option>Delete</option>
              //</Select>
            </HStack>
          </Box>
        </ListItem>
      ))}
    </List>
  );
};

export default EventsDisplayContainer;

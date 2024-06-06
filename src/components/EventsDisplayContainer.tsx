import { List, ListItem, HStack, Button, Select } from "@chakra-ui/react";
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
          <HStack>
            <Link
              to={"/competition/" + competitionId + "/" + event.id + "/results"}
            >
              <Button
                whiteSpace="normal"
                textAlign="left"
                fontSize="lg"
                variant="link"
              >
                {event.event_name}
              </Button>
            </Link>
            <Select placeholder={"..."} size="md">
              <option>Edit</option>
              <option>Delete</option>
            </Select>
          </HStack>
        </ListItem>
      ))}
    </List>
  );
};

export default EventsDisplayContainer;

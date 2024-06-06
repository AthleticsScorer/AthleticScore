import { List, ListItem, HStack, Button, Select } from "@chakra-ui/react";
import { Event } from "../pages/CreatePage";

interface Props {
  events: Event[];
}

const CreatedEventsContainer = ({ events }: Props) => {
  return (
    <List>
      {events.map((event) => (
        <ListItem key={event.id} paddingY="5px">
          <HStack>
            <Button
              whiteSpace="normal"
              textAlign="left"
              fontSize="lg"
              variant="link"
            >
              {event.event_name}
            </Button>
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

export default CreatedEventsContainer;

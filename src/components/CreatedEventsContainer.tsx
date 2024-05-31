import { List, ListItem, HStack, Button } from "@chakra-ui/react"
import { Event } from "../pages/CreatePage"

interface Props {
    events: Event[]
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
                {event.name}
              </Button>
            </HStack>
          </ListItem>
        ))}
      </List>
  )
}

export default CreatedEventsContainer
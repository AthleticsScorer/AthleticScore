import { List, ListItem, HStack, Button } from "@chakra-ui/react"
import { Event } from "../pages/CreatePage"
import { Link } from "react-router-dom"

interface Props {
    competitionId: number
    events: Event[]
}

const EventsDisplayContainer = ({ competitionId, events }: Props) => {
  return (
    <List>
        {events.map((event) => (
          <ListItem key={event.id} paddingY="5px">
            <HStack>
                <Link to={"/competition/" + competitionId + "/" + event.id}>
              <Button
                whiteSpace="normal"
                textAlign="left"
                fontSize="lg"
                variant="link"
              >
                {event.name}
              </Button></Link>
            </HStack>
          </ListItem>
        ))}
      </List>
  )
}

export default EventsDisplayContainer
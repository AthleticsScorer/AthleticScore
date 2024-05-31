import { List, ListItem, HStack, Button } from "@chakra-ui/react"
import { Event } from "../pages/CreatePage"
import { Link } from "react-router-dom"

interface Props {
    competitionName: String
    events: Event[]
}

const EventsDisplayContainer = ({ competitionName, events }: Props) => {
  return (
    <List>
        {events.map((event) => (
          <ListItem key={event.id} paddingY="5px">
            <HStack>
                <Link to={"/competition/" + competitionName + "/" + event.name}>
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
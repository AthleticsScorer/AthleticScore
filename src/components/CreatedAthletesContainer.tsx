import { List, ListItem, HStack, Button } from "@chakra-ui/react"
import { Athlete } from "./InputAthlete"

interface Props {
    athletes: Athlete[]
}

const CreatedAthletesContainer = ({ athletes: atheltes }: Props) => {
  return (
    <List>
        {atheltes.map((athlete) => (
          <ListItem key={athlete.id} paddingY="5px">
            <HStack>
              <Button
                whiteSpace="normal"
                textAlign="left"
                fontSize="lg"
                variant="link"
              >
                {athlete.name}
              </Button>
            </HStack>
          </ListItem>
        ))}
      </List>
  )
}

export default CreatedAthletesContainer
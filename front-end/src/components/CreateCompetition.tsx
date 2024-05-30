import { Button, Input, VStack } from '@chakra-ui/react'
import { useState } from 'react';
import { Link } from 'react-router-dom'

interface Props {
  onAdd: (name: String) => void
}

function CreateCompetition({ onAdd }: Props) {

  const [competitionName, setCompetitionName] = useState('');

    const handleAddClick = () => {
        onAdd(competitionName);
        setCompetitionName(''); 
      };


  return (
    <VStack>
      <Input placeholder="Competition Name" value={competitionName}
        onChange={(e) => setCompetitionName(e.target.value)}/>
      <Link to={"../create/" + competitionName}>
        <Button colorScheme='blue' size='lg' onClick={handleAddClick}>
          Create Competition
        </Button>
      </Link>
    </VStack>
  )
}

export default CreateCompetition
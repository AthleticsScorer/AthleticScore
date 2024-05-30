import { useParams } from "react-router-dom"


const CompetitionPage = () => {
  const { competitionName } = useParams();

  return (
    <div>Competition {competitionName}</div>
  )
}

export default CompetitionPage
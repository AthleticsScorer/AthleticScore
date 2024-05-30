import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom"
import { Competition } from "./HomePage";


const CompetitionPage = () => {
  const { competitionName } = useParams();
  const [data, setData] = useState<Competition[]>([]);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/competitions/')
      .then(response => {
        setData(response.data);
        console.log(response.data)
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const firstCompetitionName = data.length > 0 ? data[0].name : '';

  return (
    <>
    <div>{firstCompetitionName}</div>
    <div>Competition {competitionName}</div>
    </>
  )
}

export default CompetitionPage
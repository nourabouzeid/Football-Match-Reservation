import axios from 'axios';

import config from '../config/config'; 

export const viewMatchesAPI = async () => {
  return axios.get(`${config.API_URL}/matches/getAllMatches`,  {
  headers: { "Content-Type": "application/json" }
});
};

export const viewSeatsAPI = async (matchId) => {
  return axios.get(`${config.API_URL}/matches/getMatch/${matchId}`, {
    headers: { "Content-Type": "application/json" },
  });
};




import axios from 'axios';

import config from '../config/config'; 

export const updateDetails = async (data, token) => {
  return axios.put(`${config.API_URL}/guests/updateData`, data, {
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    }
  });
};

export const getDetails = async (token) => {
  return axios.get(`${config.API_URL}/guests/userDetails`, {
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    }
  });
};





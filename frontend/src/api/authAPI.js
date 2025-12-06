import axios from 'axios';

import config from '../config/config'; 

export const loginAPI = async (credentials) => {
  return axios.post(`${config.API_URL}/guests/login`, credentials, {
  headers: { "Content-Type": "application/json" }
});
};

export const signupAPI = async (data) => {
  return axios.post(`${config.API_URL}/guests/signup`, data, {
  headers: { "Content-Type": "application/json" }
});
};

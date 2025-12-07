// api/managerAPI.js
import axios from "axios";
import config from "../config/config";

const API_URL = config.API_URL;

const getAuthToken = () => {
  const auth = JSON.parse(localStorage.getItem("auth"));
  return auth?.token || "";
};

export const createMatchAPI = async (matchData) => {
  const token = getAuthToken();
  return axios.post(`${API_URL}/matches/createMatch`, matchData, {
    headers: { Authorization: `Bearer ${token}` },
  });
};


export const updateMatchAPI = async (matchId, updateData) => {
  const token = getAuthToken();
  console.log("Sending update request:", {
    url: `${API_URL}/matches/updateMatch/${matchId}`,
    data: updateData,
    headers: { Authorization: `Bearer ${token}` }
  });
  
  return axios.put(`${API_URL}/matches/updateMatch/${matchId}`, updateData, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const createStadiumAPI = async (stadiumData) => {
  const token = getAuthToken();
  return axios.post(`${API_URL}/stadium/createStadium`, stadiumData, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getAllStadiumsAPI = async () => {
  const token = getAuthToken();
  return axios.get(`${API_URL}/stadium/getAllStadiums`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getAllMatchesAPI = async () => {
  return axios.get(`${API_URL}/matches/getAllMatches`);
};

export const getMatchSeatsAPI = async (matchId) => {
  return axios.get(`${API_URL}/matches/getMatch/${matchId}`);
};
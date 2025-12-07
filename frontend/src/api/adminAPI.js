import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000", // change if different
});

// Automatically include the token
API.interceptors.request.use((config) => {
  const auth = JSON.parse(localStorage.getItem("auth"));
  if (auth?.token) {
    config.headers.Authorization = `Bearer ${auth.token}`;
  }
  return config;
});

export const getUnauthorizedUsersAPI = () =>
  API.get("/admin/getAllUnauthorized");

export const approveUserAPI = (username) =>
  API.put(`/admin/approveAuth/${username}`);

export const getAllUsersAPI = () =>
  API.get("/admin/getAllUsers");

export const deleteUserAPI = (username) =>
  API.delete(`/admin/deleteUser/${username}`);

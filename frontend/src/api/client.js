import axios from "axios";
import {AUTH_API_URL, DATA_API_URL} from '../utils/Constants'

export const authApiClient = axios.create({
  baseURL: AUTH_API_URL,
  timeout: 50000,
  headers: {
    "access-token": localStorage.getItem('authToken'),
    "Content-Type": "application/json",
  },
});

export const dataApiClient = axios.create({
  baseURL: DATA_API_URL,
  timeout: 50000,
  headers: {
    "access-token": localStorage.getItem('authToken'),
    "Content-Type": "application/json",
  },
});
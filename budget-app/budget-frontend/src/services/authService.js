import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL + '/auth';

export const register = (name, email, password) =>
    axios.post(`${API_URL}/register`, { name, email, password });

export const login = (email, password) =>
    axios.post(`${API_URL}/login`, { email, password });

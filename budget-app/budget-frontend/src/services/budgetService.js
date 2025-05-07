import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL + '/budgets';

const authHeader = () => ({
    headers: { Authorization: localStorage.getItem('token') }
});

export const createBudget = (title) =>
    axios.post(API_URL, { title }, authHeader());

export const getBudgets = () =>
    axios.get(API_URL, authHeader());

export const updateBudget = (id, title) =>
    axios.put(`${API_URL}/${id}`, { title }, authHeader());

export const deleteBudget = (id) =>
    axios.delete(`${API_URL}/${id}`, authHeader());

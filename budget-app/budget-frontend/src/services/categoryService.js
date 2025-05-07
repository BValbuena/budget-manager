import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL + '/categories';

const authHeader = () => ({
    headers: { Authorization: localStorage.getItem('token') }
});

export const addCategory = (budgetId, name, estimatedCost, actualCost) =>
    axios.post(`${API_URL}/${budgetId}`, { name, estimatedCost, actualCost }, authHeader());

export const updateCategory = (id, name, estimatedCost, actualCost) =>
    axios.put(`${API_URL}/${id}`, { name, estimatedCost, actualCost }, authHeader());

export const deleteCategory = (id) =>
    axios.delete(`${API_URL}/${id}`, authHeader());

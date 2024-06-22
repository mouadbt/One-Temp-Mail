import axios from 'axios';

const API_BASE_URL = 'https://api.mail.tm';

export const getDomains = async () => {
    const response = await axios.get(`${API_BASE_URL}/domains`);
    return response.data['hydra:member'];
};

export const createAccount = async (address, password) => {
    const API_BASE_URL = 'https://api.mail.tm';
    const response = await axios.post(`${API_BASE_URL}/accounts`, { address, password });
    return response.data;
};

export const getToken = async (address, password) => {
    const response = await axios.post(`${API_BASE_URL}/token`, { address, password });
    return response.data.token;
};

export const getMessages = async (token) => {
    const response = await axios.get(`${API_BASE_URL}/messages`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data['hydra:member'];
};

export const getMessageContentById = async (id, token) => {
    const response = await axios.get(`${API_BASE_URL}/messages/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
};


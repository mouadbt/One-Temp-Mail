import axios from 'axios';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getDomains = async () => {
    const response = await axios.get(`${API_BASE_URL}/domains`);
    return response.data['hydra:member'];
};

export const createAccount = async (address, password) => {
    const API_BASE_URL = 'https://api.mail.tm';
    const response = await axios.post(`${API_BASE_URL}/accounts`, { address, password });
    return response;
};

export const getToken = async (address, password) => {
    const response = await axios.post(`${API_BASE_URL}/token`, { address, password });
    return response.data.token
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





// import axios from 'axios';

// const API_BASE_URL = 'https://api.mail.tm';


// export const getDomains = async () => {
//     const response = await axios.get(`${API_BASE_URL}/domains`);
//     return response.data['hydra:member'];
// };
// // Helper function to validate token format
// const isTokenValid = (token) => {
//     return typeof token === 'string' && token.length > 0;
// };

// // Helper function to get stored token with validation
// const getStoredEmailData = () => {
//     try {
//         const data = sessionStorage.getItem('emailData');
//         if (!data) return null;

//         const parsed = JSON.parse(data);
//         if (!parsed || !parsed.token || !parsed.email) {
//             return null;
//         }
//         return parsed;
//     } catch (error) {
//         console.error('Error reading stored email data:', error);
//         return null;
//     }
// };

// // Token refresh function
// export const refreshToken = async () => {
//     const emailData = getStoredEmailData();
//     if (!emailData) {
//         throw new Error('No stored email credentials');
//     }

//     try {
//         const response = await axios.post(`${API_BASE_URL}/token`, {
//             address: emailData.email,
//             password: emailData.password // You'll need to store the password in emailData
//         });

//         if (response.data && response.data.token) {
//             // Update stored token
//             const updatedData = { ...emailData, token: response.data.token };
//             sessionStorage.setItem('emailData', JSON.stringify(updatedData));
//             return response.data.token;
//         }
//         throw new Error('Invalid token response');
//     } catch (error) {
//         console.error('Token refresh failed:', error);
//         throw error;
//     }
// };

// // Modified getMessage function with retry logic
// export const getMessages = async (token) => {
//     if (!isTokenValid(token)) {
//         throw new Error('Invalid token format');
//     }

//     try {
//         const response = await axios.get(`${API_BASE_URL}/messages`, {
//             headers: {
//                 'Authorization': `Bearer ${token}`,
//                 'Accept': 'application/json'
//             }
//         });
//         return response.data;
//     } catch (error) {
//         if (error.response && error.response.status === 401) {
//             try {
//                 // Try to refresh token
//                 const newToken = await refreshToken();
//                 // Retry with new token
//                 const retryResponse = await axios.get(`${API_BASE_URL}/messages`, {
//                     headers: {
//                         'Authorization': `Bearer ${newToken}`,
//                         'Accept': 'application/json'
//                     }
//                 });
//                 return retryResponse.data;
//             } catch (refreshError) {
//                 console.error('Token refresh failed:', refreshError);
//                 throw new Error('Authentication failed after token refresh');
//             }
//         }
//         throw error;
//     }
// };

// // Modified createAccount function
// export const createAccount = async (address, password) => {
//     try {
//         const response = await axios.post(`${API_BASE_URL}/accounts`, {
//             address,
//             password
//         });

//         // Store both email and password for potential token refresh
//         const emailData = {
//             email: address,
//             password: password,
//             token: null // Will be set after getting token
//         };
//         sessionStorage.setItem('emailData', JSON.stringify(emailData));

//         return response;
//     } catch (error) {
//         console.error('Account creation failed:', error);
//         throw error;
//     }
// };

// // Modified getToken function
// export const getToken = async (address, password) => {
//     try {
//         const response = await axios.post(`${API_BASE_URL}/token`, {
//             address,
//             password
//         });

//         if (response.data && response.data.token) {
//             // Update stored data with token
//             const emailData = getStoredEmailData();
//             if (emailData) {
//                 emailData.token = response.data.token;
//                 sessionStorage.setItem('emailData', JSON.stringify(emailData));
//             }
//             return response.data.token;
//         }
//         throw new Error('Invalid token response');
//     } catch (error) {
//         console.error('Token retrieval failed:', error);
//         throw error;
//     }
// };

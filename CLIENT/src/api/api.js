import axios from 'axios'
const baseURL = process.env.NODE_ENV === 'production'? '/api': 'http://localhost:3000/api';

export default axios.create({
    baseURL,
    headers:{
        'Content-type': 'application/json',
    },
    withCredentials: true,
});
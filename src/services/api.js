import axios from 'axios';


const api = axios.create({
    timeout: 1000,
    baseURL: 'https://api-rhprocess.herokuapp.com/'
});

export default api;
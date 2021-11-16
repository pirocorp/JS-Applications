import apiConstants from './apiConstants.js';
import authService from './authService.js';

async function generic(endpoint, method, data = {}) {
    const uri = apiConstants.baseUrl + endpoint;
    const token = authService.getToken();

    let options = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
        },        
    };

    if(token) {
        options.headers['X-Authorization'] = token;
    }

    if(method !== 'GET' && method !== 'DELETE') {
        options.body = JSON.stringify(data)
    }

    try {
        const response = await fetch(uri, options);

        if(response.ok != true) {
            const error = await response.json();
            throw new Error(error.message);
        }

        const data = await response.json();

        return {
            success: true,
            data: data,
        }
    } catch (error) {
        return {
            success: false,
            data: error.message
        }
    }
};

const get = async (endpoint) => generic(endpoint, 'GET');

const post = async (endpoint, data = {}) => generic(endpoint, 'POST', data);

const put = async (endpoint, data = {}) => generic(endpoint, 'PUT', data);

const patch = async (endpoint, data = {}) => generic(endpoint, 'PATCH', data);

const del = async (endpoint) => generic(endpoint, 'DELETE');

const requester = {
    get,
    post,
    put,
    patch,
    del,
    generic
};

export default requester;
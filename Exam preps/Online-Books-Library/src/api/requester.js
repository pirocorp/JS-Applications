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
            if(response.status == 403 && token) {
                authService.logout();

                return generic(endpoint, method, data);
            }

            const error = await response.json();
            throw new Error(error.message);
        }

        let responseData;

        if(response.status != 204) {
            responseData = await response.json();
        }

        return {
            success: true,
            data: responseData,
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
    delete: del,
    generic
};

export default requester;
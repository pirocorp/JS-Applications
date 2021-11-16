import requesterService from './requester.js';
import authService from './authService.js';

const endpoint = '/users';
const registerEndpoint = `${endpoint}/register`;
const loginEndpoint = `${endpoint}/login`;

async function register (data) {
    const result = await requesterService.post(registerEndpoint, data);

    if(result.success) {
        authService.setCurrentUser(result.data);
    }

    return result;
}

async function login (data) {
    const result = await requesterService.post(loginEndpoint, data);

    if(result.success) {
        authService.setCurrentUser(result.data);
    }

    return result;
}

const isAuthenticated = () => authService.getToken() !== undefined;

const getCurrentUser = () => authService.getCurrentUser();

const getToken = () => authService.getToken();

const getUserId = () => authService.getUserId();

const logout = () => authService.logout();

const userService = {
    register,
    login,
    getCurrentUser,
    getToken,
    getUserId,
    isAuthenticated,
    logout
};

export default userService;
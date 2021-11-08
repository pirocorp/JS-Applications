const userDataName = 'userData'

function setCurrentUser(data) {
    const userData = {
        email: data.email,
        id: data._id,
        token: data.accessToken
    };

    localStorage.setItem(userDataName, JSON.stringify(userData));
}

function getCurrentUser() {
    const userString = localStorage.getItem(userDataName);
    const user = JSON.parse(userString);

    return user;
}

function logout() {
    localStorage.removeItem(userDataName);
}

const getToken = () => getCurrentUser()?.token;

const getUserId = () => getCurrentUser().id;

const authService = {
    setCurrentUser,
    getCurrentUser,
    getToken,
    logout,
    getUserId,
}

export default authService;
import http from './http-common'

const login = (loginData) => {
    if (!loginData.emailOrUsername) {
        throw new Error('Email or username is required');
    }

    const isEmail = loginData.emailOrUsername.includes('@');

    const payload = {
        login: loginData.emailOrUsername,
        password: loginData.password
    }

    return http.post('/api/auth/login', payload)
}

const userInfo = () => {
    return http.get('/api/auth/user-info');
}

const logout = () => {
    return http.post('/api/auth/logout');
}

const updateProfile = (payload) => {
    return http.put('/api/auth/update-profile', payload);
};

const authService = {
    login,
    userInfo,
    logout,
    updateProfile
}

export default authService
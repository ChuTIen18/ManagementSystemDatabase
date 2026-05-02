let _accessToken = null;
export const tokenStore = {
    getToken() {
        return _accessToken;
    },
    setToken(token) {
        _accessToken = token;
    },
    clear() {
        _accessToken = null;
    },
};
export default tokenStore;

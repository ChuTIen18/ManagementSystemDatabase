let _accessToken: string | null = null;

export const tokenStore = {
    getToken(): string | null {
        return _accessToken;
    },
    setToken(token: string | null) {
        _accessToken = token;
    },
    clear() {
        _accessToken = null;
    },
};

export default tokenStore;

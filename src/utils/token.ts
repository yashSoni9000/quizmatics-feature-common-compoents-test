export const getToken = () => {
    return localStorage.getItem("AUTH_TOKEN");
};

export const setToken = (token: string) => {
    localStorage.setItem("AUTH_TOKEN", token);
};

export const removeToken = () => {
    localStorage.removeItem("AUTH_TOKEN");
};

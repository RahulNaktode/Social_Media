const isUserLoggedIn = () => {
    const userJwtToken = localStorage.getItem("userJwtToken");

    return !!userJwtToken;
}

const getUserJwtToken = () => {
    const userJwtToken = localStorage.getItem("userJwtToken");

    return userJwtToken;
}

const getUserData = () => {
    const userData = localStorage.getItem("userData") || "{}";

    return JSON.parse(userData);
}

const logoutUser = () => {
    localStorage.clear();
    setTimeout(() => {
        window.location.href = "/login";
    }, 1000);
};

export {
    isUserLoggedIn,
    getUserJwtToken,
    getUserData,
    logoutUser
}
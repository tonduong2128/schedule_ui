import jwt_decode from "jwt-decode";
const routeExcept = ["/login", "/forgot-password"]
function handleResponse(result) {
    const { token } = result;
    if (!!token) { // the same STATUS_USER.exprid === code
        localStorage.setItem(process.env.REACT_APP_TOKEN_KEY, token);
    } else {
        localStorage.removeItem(process.env.REACT_APP_TOKEN_KEY);
        if (!routeExcept.includes(window.location.pathname)) {
            window.location = "/login"
        }
    }
    return result
}
const customFetch = async (url, options, _headers = {}) => {
    const headers = {
        "Content-Type": "application/json",
        ..._headers,
        authorization: localStorage.getItem(process.env.REACT_APP_TOKEN_KEY)
    }
    const responseHandle = await fetch(url, {
        headers,
        ...options
    })
        .then(r => r.json())
        .then(handleResponse)
    return responseHandle
}

const getUser = () => {
    const token = localStorage.getItem(process.env.REACT_APP_TOKEN_KEY);
    try {
        const user = jwt_decode(token)
        return user
    } catch (e) {
        return null
    }
}

export { customFetch as fetch, getUser };


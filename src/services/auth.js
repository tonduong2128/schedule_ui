import { fetch } from "../utils"

const Auth = {
    async login(username, password) {
        const user = {
            username,
            password
        }
        return fetch(`${process.env.REACT_APP_API_URL}/auth/login`, {
            method: "POST",
            body: JSON.stringify({
                user,
            }),
        })
    },
    async reset(body) {
        return fetch(`${process.env.REACT_APP_API_URL}/auth/reset`, {
            method: "POST",
            body: JSON.stringify(body),
        })
    },
    async resetForce(user) {
        return fetch(`${process.env.REACT_APP_API_URL}/auth/reset-force`, {
            method: "POST",
            body: JSON.stringify({ user }),
        })
    },
    async changePassword(oldPassword, newPassword) {
        return fetch(`${process.env.REACT_APP_API_URL}/auth/change-password`, {
            method: "POST",
            body: JSON.stringify({ oldPassword, newPassword }),
        })
    },
    async logout() {
        return localStorage.removeItem(process.env.REACT_APP_TOKEN_KEY)
    },
    checkLogin() {
        return !!localStorage.getItem(process.env.REACT_APP_TOKEN_KEY)
    }
}
export default Auth
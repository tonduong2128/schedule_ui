import { fetch } from "../utils"

const User = {
    async getStudents(seacherOption, searchModel, searchOther = {}) {
        return fetch(`${process.env.REACT_APP_API_URL}/user?searchOption=${JSON.stringify(seacherOption)}&searchModel=${JSON.stringify(searchModel)}&searchOther=${JSON.stringify(searchOther)}`)
    },
    async getUserById(id) {
        return fetch(`${process.env.REACT_APP_API_URL}/user/${id}`)
    },
    async getUsers(seacherOption, searchModel, searchOther = {}) {
        return fetch(`${process.env.REACT_APP_API_URL}/user?searchOption=${JSON.stringify(seacherOption)}&searchModel=${JSON.stringify(searchModel)}&searchOther=${JSON.stringify(searchOther)}`)
    },
    async createUser(user) {
        return fetch(`${process.env.REACT_APP_API_URL}/user`, {
            method: "POST",
            body: JSON.stringify({ user })
        })
    },
    async updateUser(user) {
        return fetch(`${process.env.REACT_APP_API_URL}/user`, {
            method: "PATCH",
            body: JSON.stringify({ user })
        })
    },
    async deletes(userIds) {
        return fetch(`${process.env.REACT_APP_API_URL}/user`, {
            method: "DELETE",
            body: JSON.stringify({ userIds })
        })
    }
}
export default User
import { fetch } from "../utils"

const Role = {
    async getRoles(seacherOption, searchModel, searchOther = {}) {
        return fetch(`${process.env.REACT_APP_API_URL}/role?searchOption=${JSON.stringify(seacherOption)}&searchModel=${JSON.stringify(searchModel)}&searchOther=${JSON.stringify(searchOther)}`)
    },
}
export default Role
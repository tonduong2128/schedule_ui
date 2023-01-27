import { fetch } from "../utils"

const TeacherHour = {
    async getTeacherHour(seacherOption, searchModel, searchOther = {}) {
        return fetch(`${process.env.REACT_APP_API_URL}/teacher-hour?searchOption=${JSON.stringify(seacherOption)}&searchModel=${JSON.stringify(searchModel)}&searchOther=${JSON.stringify(searchOther)}`)
    },
    async creaTeacherHour(teacherHour) {
        return fetch(`${process.env.REACT_APP_API_URL}/teacher-hour`, {
            method: "POST",
            body: JSON.stringify({ teacherHour })
        })
    },
    async updateTeacherHour(teacherHour) {
        return fetch(`${process.env.REACT_APP_API_URL}/teacher-hour`, {
            method: "PATCH",
            body: JSON.stringify({ teacherHour })
        })
    },
}

export default TeacherHour
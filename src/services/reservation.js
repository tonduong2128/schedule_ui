import { fetch } from "../utils"

const Reservation = {
    async getReservations(seacherOption, searchModel) {
        return fetch(`${process.env.REACT_APP_API_URL}/reservation?searchOption=${JSON.stringify(seacherOption)}&searchModel=${JSON.stringify(searchModel)}`)
    },
    async addReservation(reservation) {
        return fetch(`${process.env.REACT_APP_API_URL}/reservation`, {
            method: "POST",
            body: JSON.stringify({ reservation })
        })
    },
    async updateReservation(reservation) {
        return fetch(`${process.env.REACT_APP_API_URL}/reservation`, {
            method: "PATCH",
            body: JSON.stringify({ reservation })
        })
    },
    async deleteReservations(reservationIds) {
        return fetch(`${process.env.REACT_APP_API_URL}/reservation`, {
            method: "DELETE",
            body: JSON.stringify({ reservationIds })
        })
    }
}
export default Reservation
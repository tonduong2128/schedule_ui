import { fetch } from "../utils"

const VehicleType = {
    async getVehicleTypes(seacherOption, searchModel, searchOther = {}) {
        return fetch(`${process.env.REACT_APP_API_URL}/vehicle-type?searchOption=${JSON.stringify(seacherOption)}&searchModel=${JSON.stringify(searchModel)}&searchOther=${JSON.stringify(searchOther)}`)
    },
    async getVehicleTypeById(id) {
        return fetch(`${process.env.REACT_APP_API_URL}/vehicle-type/${id}`)
    },
    async createVehicleType(vehicleType) {
        return fetch(`${process.env.REACT_APP_API_URL}/vehicle-type`, {
            method: "POST",
            body: JSON.stringify({ vehicleType })
        })
    },
    async updateVehicleType(vehicleType) {
        return fetch(`${process.env.REACT_APP_API_URL}/vehicle-type`, {
            method: "PATCH",
            body: JSON.stringify({ vehicleType })
        })
    },
    async deletes(vehicleTypeIds) {
        return fetch(`${process.env.REACT_APP_API_URL}/vehicle-type`, {
            method: "DELETE",
            body: JSON.stringify({ vehicleTypeIds })
        })
    }
}
export default VehicleType
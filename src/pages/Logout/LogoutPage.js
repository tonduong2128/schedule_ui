import { Navigate, useNavigate } from "react-router-dom"
import { Auth } from "../../services"


const LogoutPage = (props) => {
    Auth.logout()
    return <Navigate to="/login" />
}

export default LogoutPage;
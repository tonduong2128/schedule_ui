import { Navigate, Outlet } from "react-router-dom";
import Auth from "../services/auth";

const PrivateRoute = ({ path, element, ...props }) => {
    const isLogin = Auth.checkLogin();
    return isLogin ? <Outlet /> : <Navigate to="/login" />;
}

export default PrivateRoute
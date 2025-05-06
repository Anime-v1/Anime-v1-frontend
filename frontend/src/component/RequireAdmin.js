
import {Navigate} from "react-router-dom";
export const RequireAdmin = ({children})=>{
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (!token||role!=="ROLE_ADMIN"){
        return <Navigate to="/home" replace />;
    }
    return children;
}
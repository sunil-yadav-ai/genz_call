import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./authContext";

function ProtectedRoute({ children }) {
    const { userData } = useContext(AuthContext);

    const token = localStorage.getItem("token");

    if (!token) {
        return <Navigate to="/auth" replace />;
    }

    return children;
}

export default ProtectedRoute;
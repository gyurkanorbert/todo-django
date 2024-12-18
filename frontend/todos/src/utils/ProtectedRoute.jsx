import React from 'react';
import useAuth from "../hooks/useAuth.jsx";
import {Navigate, useLocation} from "react-router-dom";

const ProtectedRoute = ({children}) => {

    const {isAuthenticated} = useAuth();
    const location = useLocation();


    if(!isAuthenticated){
        return <Navigate to="/login" state={{from: location.pathname}} replace />
    }

    return children
};

export default ProtectedRoute;
import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const PublicRoutes = () => {

    const {accessToken} = useSelector((state) => state.auth);   
    if(accessToken) {

        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;

}

export default PublicRoutes;
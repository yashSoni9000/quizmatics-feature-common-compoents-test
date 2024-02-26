import { ReactNode, useContext } from "react";
import { Navigate } from "react-router-dom";

import { AppContext } from "@context/AppProvider";

interface Props {
    children: ReactNode;
    redirect: string;
}

export default function PublicRoutes({ redirect, children }: Props) {
    const { role } = useContext(AppContext)?.userDetails || {};

    if (role) {
        return <Navigate to={redirect} />;
    }
    return children;
}

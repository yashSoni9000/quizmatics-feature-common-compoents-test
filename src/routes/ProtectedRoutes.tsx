import { PropsWithChildren, useContext } from "react";
import { Navigate } from "react-router-dom";

import { AppContext } from "@src/context/AppProvider";
import { Role } from "@src/ts/enums";

interface Props {
    allowedRoles: Role[];
    redirect: string;
}

export default function ProtectedRoute({
    allowedRoles,
    redirect,
    children,
}: PropsWithChildren<Props>) {
    const { role } = useContext(AppContext)?.userDetails || {};

    if (role && allowedRoles.includes(role)) {
        return children;
    }
    return <Navigate to={redirect} />;
}

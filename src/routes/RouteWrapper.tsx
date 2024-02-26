import { FC, useContext } from "react";
import { Navigate } from "react-router-dom";

import { AppContext } from "@src/context/AppProvider";
import { Role } from "@src/ts/enums";

type Props = {
    component: {
        role: Role;
        page: FC;
    }[];
    redirect?: string;
};

export default function RoleBasedRoutes({
    component,
    redirect = "/unauthorized",
}: Props) {
    const currentRole = useContext(AppContext)?.userDetails?.role;
    const Page = component.find(({ role }) => currentRole === role)?.page;

    if (!Page) return <Navigate to={redirect} />;

    return <Page />;
}

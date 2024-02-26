import { useContext, useEffect } from "react";
import axios from "axios";
import { Box } from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";

import CircularLoader from "@src/components/common/CircularLoader";
import { AppContext } from "@src/context/AppProvider";
import { STRAPI_API } from "@src/constants/endpoints";
import { setToken } from "@src/utils/token";

export default function GoogleAuthInterceptor() {
    const [myParams] = useSearchParams();

    const token = myParams.get("id_token");
    const accessToken = myParams.get("access_token");
    const navigate = useNavigate();
    const { refreshUserDetails } = useContext(AppContext) || {};

    useEffect(() => {
        if (token) {
            axios
                .get(`${STRAPI_API}/auth/google/callback`, {
                    params: { id_token: token, access_token: accessToken },
                })
                .then(({ data }) => {
                    setToken(data.jwt);
                    refreshUserDetails?.();
                })
                .finally(() => {
                    const role = localStorage.getItem("role");
                    if (role === "host") {
                        navigate("/signup/host");
                    } else {
                        navigate("/signup");
                    }
                });
        } else {
            navigate("/signup");
        }
    }, []);

    return (
        <Box className="w-screen h-screen flex justify-center items-center">
            <CircularLoader />
        </Box>
    );
}

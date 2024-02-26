import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";

import NavBar from "@components/NavBar";
import SideBar from "@components/SideBar";

export default function Dashboard() {
    const [sideBarIsOpened, setSideBarIsOpened] = useState(false);

    function displaySideBar(value: boolean) {
        setSideBarIsOpened(value);
    }

    return (
        <>
            <Box className="flex flex-col h-screen">
                <Box className="h-16 border-b border-white">
                    <NavBar displaySideBar={displaySideBar} />
                </Box>
                <Box className="flex flex-1 overflow-hidden">
                    <Box
                        className="overflow-scroll min-w-fit max-w-fit"
                        sx={{ backgroundColor: "background.default" }}
                    >
                        <SideBar
                            sideBarIsOpened={sideBarIsOpened}
                            displaySideBar={displaySideBar}
                        />
                    </Box>
                    <Box
                        className="w-full overflow-y-auto p-3 md:p-4"
                        sx={{ backgroundColor: "background.paper" }}
                    >
                        <Outlet />
                    </Box>
                </Box>
            </Box>
            <Box
                className={`top-0 w-screen h-screen z-10 backdrop-blur-sm ${
                    sideBarIsOpened && "fixed"
                } md:hidden`}
                onClick={() => displaySideBar(false)}
            />
        </>
    );
}

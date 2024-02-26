import { createTheme } from "@mui/material/styles";
import { grey } from "@mui/material/colors";

declare module "@mui/material/styles" {
    interface TypeBackground {
        contrastText: string;
        focusColor: string;
        textBoxColor: string;
        backgroundLght: string;
    }
}

const rootElement = document.getElementById("root");

export const lightTheme = createTheme({
    typography: {
        fontFamily: "gotham-pro",
    },
    palette: {
        mode: "light",
        primary: {
            main: "#1976d2",
        },
        secondary: {
            main: grey[900],
        },
        background: {
            default: "#ffffff",
            paper: "#f2f2f2",
            contrastText: "black",
            focusColor: "#1976d2",
            textBoxColor: "#ffffff",
            backgroundLght: "rgb(248 250 252)",
        },
    },
    components: {
        MuiPopover: {
            defaultProps: {
                container: rootElement,
            },
        },
        MuiPopper: {
            defaultProps: {
                container: rootElement,
            },
        },
        MuiDialog: {
            defaultProps: {
                container: rootElement,
            },
        },
        MuiTab: {
            styleOverrides: {
                root: {
                    "&.Mui-selected": {
                        color: "#1976d2",
                    },
                },
            },
        },
        MuiTabs: {
            styleOverrides: {
                root: {
                    "& .MuiTabs-indicator": {
                        color: "#1976d2",
                    },
                },
            },
        },
        MuiInput: {
            styleOverrides: {
                root: {
                    "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
                        {
                            display: "none",
                        },
                    "& input[type=number]": {
                        MozAppearance: "textfield",
                    },
                },
            },
        },
    },
});

export const darkTheme = createTheme({
    typography: {
        fontFamily: "gotham-pro",
    },
    palette: {
        mode: "dark",
        primary: {
            main: "#161C34",
        },
        secondary: {
            main: grey[900],
        },
        background: {
            default: "#161C34",
            paper: "#2d3348",
            contrastText: "white",
            focusColor: "#2d3348",
            textBoxColor: "#2d3348",
            backgroundLght: "#1f2434",
        },
    },
    components: {
        MuiPopover: {
            defaultProps: {
                container: rootElement,
            },
        },
        MuiPopper: {
            defaultProps: {
                container: rootElement,
            },
        },
        MuiDialog: {
            defaultProps: {
                container: rootElement,
            },
        },
        MuiTab: {
            styleOverrides: {
                root: {
                    "&.Mui-selected": {
                        color: "#ffffff",
                    },
                },
            },
        },
        MuiTabs: {
            styleOverrides: {
                root: {
                    "& .MuiTabs-indicator": {
                        backgroundColor: "#fff",
                    },
                },
            },
        },
        MuiInput: {
            styleOverrides: {
                root: {
                    "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
                        {
                            display: "none",
                        },
                    "& input[type=number]": {
                        MozAppearance: "textfield",
                    },
                },
            },
        },
    },
});

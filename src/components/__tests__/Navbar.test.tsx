import { fireEvent, render, screen } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import "@testing-library/jest-dom";

import NavBar from "../NavBar";
import AppProviderMock from "@src/test-helpers/components/AppProviderMock";

const mockedDisplaySidebar = jest.fn();
const mockedUsedNavigate = jest.fn();

jest.useFakeTimers();

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => mockedUsedNavigate,
}));

describe("Navbar Test", () => {
    it("snapshot test", () => {
        const { asFragment } = render(
            <AppProviderMock>
                <NavBar displaySideBar={mockedDisplaySidebar} />
            </AppProviderMock>,
        );

        expect(asFragment()).toMatchSnapshot();
    });

    it("Profile menu is opened when clicked on it", () => {
        render(
            <AppProviderMock>
                <NavBar displaySideBar={mockedDisplaySidebar} />,
            </AppProviderMock>,
        );
        const profileButton = screen.getByLabelText("Open settings");
        const logoutButton = screen.getByText("Logout");

        fireEvent.click(profileButton);

        expect(logoutButton).toBeVisible();
    });

    it("Logout button logs out the user", async () => {
        render(
            <AppProviderMock>
                <NavBar displaySideBar={mockedDisplaySidebar} />
            </AppProviderMock>,
        );

        const profileButton = screen.getByLabelText("Open settings");
        fireEvent.click(profileButton);

        const logoutButton = screen.getByText("Logout");
        const logoutScreen = screen.getByTestId("logoutScreen");

        expect(logoutScreen).toHaveClass("hidden");
        fireEvent.click(logoutButton);
        expect(logoutScreen).toHaveClass("flex");

        act(() => {
            jest.runAllTimers();
        });
        await expect(mockedUsedNavigate).toHaveBeenCalledTimes(1);
    });

    it("Clicking on theme button change theme", async () => {
        const mockedChangeTheme = jest.fn();

        render(
            <AppProviderMock value={{ changeTheme: mockedChangeTheme }}>
                <NavBar displaySideBar={mockedDisplaySidebar} />
            </AppProviderMock>,
        );

        const themeSwitchElement = screen.getByTestId("theme-switch");
        const themeSwitch = themeSwitchElement.querySelector("input");

        if (!themeSwitch) throw new Error();

        fireEvent.change(themeSwitch, { target: { checked: true } });
        fireEvent.click(themeSwitch);

        expect(mockedChangeTheme).toHaveBeenNthCalledWith(1, "light");

        fireEvent.change(themeSwitch, { target: { checked: false } });
        fireEvent.click(themeSwitch);

        expect(mockedChangeTheme).toHaveBeenNthCalledWith(2, "dark");
    });
});

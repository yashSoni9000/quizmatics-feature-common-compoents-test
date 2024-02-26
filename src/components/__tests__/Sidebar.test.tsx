import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import SideBar from "../SideBar";
import { MemoryRouter } from "react-router-dom";

const mockedDisplaySidebar = jest.fn();
const mockedUsedLocation = jest.fn();

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useLocation: mockedUsedLocation,
}));

describe("Sidebar Test", () => {
    it("snapshot test", () => {
        const { asFragment } = render(
            <MemoryRouter>
                <SideBar
                    sideBarIsOpened={true}
                    displaySideBar={mockedDisplaySidebar}
                />
            </MemoryRouter>,
        );

        expect(asFragment()).toMatchSnapshot();
    });

    it("Clicking on Arrow button collpase sidebar", () => {
        const { asFragment } = render(
            <MemoryRouter>
                <SideBar
                    sideBarIsOpened={true}
                    displaySideBar={mockedDisplaySidebar}
                />
            </MemoryRouter>,
        );

        const toggleButton = screen.getByTestId("collapse-button");
        const sideBar = screen.getByTestId("sidebar");

        expect(sideBar).toHaveClass("flex");
        fireEvent.click(toggleButton);
        expect(sideBar).toHaveClass("lg:w-16");

        fireEvent.click(toggleButton);
        expect(sideBar).toHaveClass("flex");

        expect(asFragment()).toMatchSnapshot();
    });

    it("Clicking on sidebar button set it to active button", () => {
        render(
            <MemoryRouter>
                <SideBar
                    sideBarIsOpened={true}
                    displaySideBar={mockedDisplaySidebar}
                />
            </MemoryRouter>,
        );

        const navLinkButtons = screen.getAllByRole("link");
        const navLinkButton = navLinkButtons.find(
            (button) => !button.classList.contains("active"),
        );

        const listItemButton = navLinkButton?.querySelector("[role=button]");

        if (!listItemButton) throw new Error();

        expect(navLinkButton).not.toHaveClass("active");
        fireEvent.click(listItemButton);

        expect(navLinkButton).toHaveClass("active");
        expect(mockedDisplaySidebar).toHaveBeenCalledWith(false);
    });
});

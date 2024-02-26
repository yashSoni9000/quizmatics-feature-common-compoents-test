import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";

import Dashboard from "../Dashboard";
import AppProviderMock from "@src/test-helpers/components/AppProviderMock";
import { resizeWindow } from "@src/test-helpers/utils";

describe("Dashboard Test", () => {
    it("snapshot test", () => {
        const { asFragment } = render(
            <MemoryRouter>
                <AppProviderMock>
                    <Dashboard />
                </AppProviderMock>
            </MemoryRouter>,
        );

        expect(asFragment()).toMatchSnapshot();
    });

    it("Navbar and Sidebar Integration test", () => {
        const { asFragment } = render(
            <MemoryRouter>
                <AppProviderMock>
                    <Dashboard />
                </AppProviderMock>
            </MemoryRouter>,
        );
        const background = screen.getAllByRole("generic").slice(-1)[0];
        const sidebar = screen.getByTestId("sidebar");
        const menuButton = screen.getByLabelText("menu-appbar");

        resizeWindow(640, 480);

        fireEvent.click(menuButton);
        expect(sidebar).toHaveClass("flex");
        fireEvent.click(background);
        expect(sidebar).toHaveClass("hidden");

        expect(asFragment()).toMatchSnapshot();
    });
});

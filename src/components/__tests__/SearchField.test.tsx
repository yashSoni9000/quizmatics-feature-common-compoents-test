import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import SearchField from "@src/components/SearchField";

let onChangeMock: ReturnType<typeof jest.fn>;

beforeEach(() => {
    onChangeMock = jest.fn();
});

describe("Search Field Test", () => {
    it("snapshot test", () => {
        const { asFragment } = render(<SearchField searchText="" />);

        expect(asFragment()).toMatchSnapshot();
    });

    it("Changing value of search field invokes onChange with value", async () => {
        render(<SearchField searchText="" onChange={onChangeMock} />);

        const searchField = screen.getByRole("textbox");
        fireEvent.change(searchField, { target: { value: "text" } });

        expect(onChangeMock).toHaveBeenCalled();
    });
});

import {
    fireEvent,
    render,
    renderHook,
    screen,
    within,
} from "@testing-library/react";
import "@testing-library/jest-dom";

import SearchButton, { SearchButtonProps } from "../SearchButton";
import { act } from "react-dom/test-utils";

import UseFilterOptionHooks, {
    FilterListData,
} from "@src/hooks/UseFilterOptionHooks";

let updateDataMock: ReturnType<typeof jest.fn>;
let callbackMock: ReturnType<typeof jest.fn>;
let onChangeMock: ReturnType<typeof jest.fn>;

let filterHook: ReturnType<typeof UseFilterOptionHooks>;
const mockData = [
    { label: "Option 1", value: 1 },
    { label: "Option 2", value: 2 },
];

beforeEach(() => {
    updateDataMock = jest.fn();
    callbackMock = jest.fn();
    onChangeMock = jest.fn();

    filterHook = renderHook(() =>
        UseFilterOptionHooks(
            mockData,
            callbackMock,
            jest.fn(),
            undefined,
            false,
        ),
    ).result.current;
});

function SearchButtonComponent({ ...props }: Partial<SearchButtonProps>) {
    return (
        <SearchButton
            {...filterHook}
            Icon={jest.fn()}
            updateData={updateDataMock}
            {...props}
        />
    );
}

describe("Search Button Test", () => {
    it("snapshot test", () => {
        const { asFragment } = render(<SearchButtonComponent />);

        expect(asFragment()).toMatchSnapshot();
    });

    it("Clicking on search button opens dropdown", () => {
        render(<SearchButtonComponent />);

        const searchButton = screen.getByLabelText("Search Button");
        fireEvent.click(searchButton);

        const searchMenu = screen.getByLabelText("Search Menu");
        expect(searchMenu).toBeVisible();
    });

    it("Clicking on menu item invokes on click and hides the menu", async () => {
        render(<SearchButtonComponent handleOnChange={onChangeMock} />);

        const searchButton = screen.getByLabelText("Search Button");
        fireEvent.click(searchButton);

        const listItems = screen.getAllByRole("listitem");
        expect(listItems).toHaveLength(filterHook.list.length);

        const listItem = screen.getByText(mockData[0].label);
        await act(() => fireEvent.click(listItem));

        expect(onChangeMock).toHaveBeenCalledWith(mockData[0].value);

        const searchMenu = screen.getByLabelText("Search Menu");
        expect(searchMenu).toHaveAttribute("aria-hidden", "true");
    });

    it("Typing in search Field changes the value and hides the unmatched options", () => {
        let filteredData: FilterListData[] = mockData;

        function handleOnSearchChangeMock(value?: string) {
            if (value) {
                filteredData = mockData.filter(({ label }) =>
                    label.includes(value),
                );
            } else {
                filteredData = mockData;
            }
        }

        function GenericSearchButtonComponent() {
            return (
                <SearchButtonComponent
                    list={filteredData}
                    handleOnSearchChange={handleOnSearchChangeMock}
                />
            );
        }

        function rerenderComponent() {
            rerender(<GenericSearchButtonComponent />);
        }

        const { rerender } = render(<GenericSearchButtonComponent />);

        const searchButton = screen.getByLabelText("Search Button");
        fireEvent.click(searchButton);

        const searchField = screen.getByRole("textbox");
        const list = screen.getByRole("list");

        fireEvent.change(searchField, { target: { value: mockData[0].label } });

        rerenderComponent();

        const optionOne = within(list).queryByText(mockData[0].label);
        const optionTwo = within(list).queryByText(mockData[1].label);

        expect(optionOne).toBeInTheDocument();
        expect(optionTwo).not.toBeInTheDocument();
    });
});

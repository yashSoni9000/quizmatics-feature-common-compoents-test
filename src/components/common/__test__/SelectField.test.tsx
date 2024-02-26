import { fireEvent, render, renderHook, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import UseFilterOptionHooks from "@src/hooks/UseFilterOptionHooks";
import SelectField, { SelectFieldProps } from "../SelectField";

let callbackMock: ReturnType<typeof jest.fn>;
let handleOnChangeMock: ReturnType<typeof jest.fn>;
let filterHook: ReturnType<typeof UseFilterOptionHooks>;

const mockData = [
    { label: "7 days", value: 1 },
    { label: "15 days", value: 2 },
];

beforeEach(() => {
    callbackMock = jest.fn();
    handleOnChangeMock = jest.fn();

    filterHook = renderHook(() => UseFilterOptionHooks(mockData, callbackMock))
        .result.current;
});

function SelectFieldComponent({ ...props }: Partial<SelectFieldProps>) {
    return (
        <SelectField
            {...filterHook}
            label="label"
            defaultValue={mockData[0]}
            {...props}
        />
    );
}

describe("Select component test", () => {
    it("snapshot test", () => {
        const { asFragment } = render(<SelectFieldComponent />);

        expect(asFragment()).toMatchSnapshot();
    });

    it("Focusing on Autocomplete open popup menu", () => {
        render(<SelectFieldComponent />);

        const selectField = screen.getByTestId("autocomplete-select");
        fireEvent.keyDown(selectField, { key: "ArrowDown" });

        const list = screen.getByRole("listbox");
        expect(list).toBeVisible();
    });

    it("changing value invokes onChange and changes value", () => {
        render(<SelectFieldComponent handleOnChange={handleOnChangeMock} />);

        const selectField = screen.getByTestId("autocomplete-select");
        fireEvent.keyDown(selectField, { key: "ArrowDown" });

        const optionTwo = screen.getByText(mockData[1].label);
        fireEvent.click(optionTwo);

        expect(handleOnChangeMock).toHaveBeenCalledWith(mockData[1].value);
    });
});

import {
    fireEvent,
    render,
    renderHook,
    screen,
    within,
} from "@testing-library/react";
import "@testing-library/jest-dom";

import ListDisplay, { ListDisplayData, ListDisplayProps } from "../ListDisplay";
import UseGenericStateHooks from "@src/hooks/UseGenericStateHook";

let listDisplayCardData: ReturnType<
    typeof UseGenericStateHooks<ListDisplayData[]>
>;
let updateDataMock: ReturnType<typeof jest.fn>;
const mockData = [
    { id: 1, label: "item 1", value: 20 },
    { id: 2, label: "item 2", value: 30 },
    { id: 3, label: "item 3", value: 40 },
];

beforeEach(() => {
    updateDataMock = jest.fn();
});

jest.useFakeTimers();

beforeEach(() => {
    updateDataMock = jest.fn();
    listDisplayCardData = renderHook(() =>
        UseGenericStateHooks<ListDisplayData[]>(mockData),
    ).result.current;
});

function ListDisplayComponent({ ...props }: Partial<ListDisplayProps>) {
    return (
        <ListDisplay
            {...listDisplayCardData}
            updateData={updateDataMock}
            isLoading={false}
            {...props}
        />
    );
}

describe("List Display Test", () => {
    it("Data is rendered correctly", () => {
        const { asFragment } = render(<ListDisplayComponent />);

        const list = screen.getByRole("list");

        mockData.forEach(({ label, value }) => {
            expect(within(list).getByText(label)).toBeVisible();
            expect(within(list).getByText(value)).toBeVisible();
        });

        expect(asFragment()).toMatchSnapshot();
    });

    it("Skeletons are visible when component is loading", () => {
        render(<ListDisplayComponent isLoading={true} />);

        const skeleton = document.querySelector(".MuiSkeleton-root");
        expect(skeleton).toBeVisible();
    });

    it("Simulating from error state to non-error state", () => {
        let loading = false,
            error = true;

        function GenericListDisplayComponent() {
            return (
                <ListDisplayComponent
                    isLoading={loading}
                    error={error}
                    refreshData={refreshComponentMock}
                />
            );
        }

        function rerenderComponent() {
            rerender(<GenericListDisplayComponent />);
        }

        function refreshComponentMock() {
            error = false;
            loading = true;

            setTimeout(() => {
                loading = false;
            }, 1000);
        }

        const { rerender } = render(<GenericListDisplayComponent />);

        const retryButton = screen.getByText("Retry").parentElement;
        expect(retryButton).toBeVisible();

        fireEvent.click(retryButton!);
        rerenderComponent();

        const skeleton = document.querySelector(".MuiSkeleton-root");
        expect(skeleton).toBeVisible();

        jest.advanceTimersByTime(1000);
        rerenderComponent();

        const list = screen.getByRole("list");
        const listItems = within(list).getAllByRole("listitem");

        expect(listItems).toHaveLength(mockData.length);
    });
});

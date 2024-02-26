import { fireEvent, render, renderHook, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import DataDisplayCard, {
    DataDisplayCardData,
    DataDisplayCardProps,
} from "../DataDisplayCard";
import UseGenericStateHooks from "@src/hooks/UseGenericStateHook";

let onClickMock: ReturnType<typeof jest.fn>;
let dataDisplayCardData: ReturnType<
    typeof UseGenericStateHooks<DataDisplayCardData[]>
>;
const mockData = { id: 1, label: "Label", value: 20 };

function DataDisplayCardComponent({ ...props }: Partial<DataDisplayCardProps>) {
    return (
        <DataDisplayCard
            {...dataDisplayCardData}
            title="title"
            fieldsCount={1}
            handleOnClick={onClickMock}
            updateData={jest.fn()}
            isLoading={false}
            {...props}
        />
    );
}

jest.useFakeTimers();

beforeEach(() => {
    onClickMock = jest.fn();
    dataDisplayCardData = renderHook(() =>
        UseGenericStateHooks<DataDisplayCardData[]>([mockData]),
    ).result.current;
});

describe("Data Display Card Test", () => {
    it("snapshot test", () => {
        const { asFragment } = render(<DataDisplayCardComponent />);

        const label = screen.getByText(mockData.label);
        expect(label).toBeVisible();

        expect(asFragment()).toMatchSnapshot();
    });

    it("Skeletons are visible when card is loading", () => {
        render(<DataDisplayCardComponent isLoading={true} />);

        const skeleton = document.querySelector(".MuiSkeleton-root");
        expect(skeleton).toBeVisible();
    });

    it("Clicking on card button invokes handleOnChange", () => {
        render(<DataDisplayCardComponent />);

        const cardButton = screen.getByText(mockData.label);
        fireEvent.click(cardButton);

        expect(onClickMock).toHaveBeenCalledWith(mockData.id);
    });

    it("DataDisplayCard simulation from error state to non-error state", async () => {
        let loading = false,
            error = true;

        function refreshComponentMock() {
            error = false;
            loading = true;

            setTimeout(() => {
                loading = false;
            }, 1000);
        }

        function GenericDataDisplayCardComponent() {
            return (
                <DataDisplayCardComponent
                    isLoading={loading}
                    error={error}
                    refreshData={refreshComponentMock}
                />
            );
        }

        function rerenderComponent() {
            rerender(<GenericDataDisplayCardComponent />);
        }

        const { rerender, asFragment } = render(
            <GenericDataDisplayCardComponent />,
        );

        const retryButton = screen.getByText("Retry").parentElement;
        if (!retryButton) throw new Error();

        expect(retryButton).toBeVisible();
        fireEvent.click(retryButton);

        rerenderComponent();

        const skeleton = document.querySelector(".MuiSkeleton-root");
        expect(skeleton).toBeVisible();

        jest.advanceTimersByTime(1000);
        rerenderComponent();

        const label = screen.getByText(mockData.label);
        expect(label).toBeVisible();

        expect(asFragment()).toMatchSnapshot();
    });
});

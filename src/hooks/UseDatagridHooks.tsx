import { useState } from "react";

import { EventFor } from "@src/ts/types";
import UseGenericStateHooks from "./UseGenericStateHook";

export default function UseDataGridHooks<Type>(
    initialData: Type,
    initialCount = 0,
    initialIsLoading = true,
    initialIsError = false,
) {
    const state = UseGenericStateHooks<Type>(
        initialData,
        initialIsLoading,
        initialIsError,
    );
    const [count, setCount] = useState(initialCount);
    const [searchText, setSearchText] = useState("");

    function updateCount(newCount: number) {
        setCount(newCount);
    }

    function updateState(
        data: Type,
        error = false,
        message?: string,
        isLoading: boolean = false,
        count?: number,
    ) {
        state.updateState(data, error, message, isLoading);
        count && setCount(count);
    }

    function updateSearchText(e: EventFor<"input", "onChange">) {
        setSearchText(e.currentTarget.value);
    }

    return {
        ...state,
        count,
        searchText,
        updateSearchText,
        updateState,
        updateCount,
    };
}

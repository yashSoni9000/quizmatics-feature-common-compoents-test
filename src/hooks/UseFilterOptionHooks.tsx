import { useEffect, useState } from "react";

export interface FilterListData {
    label: string;
    value: number;
}

export default function UseFilterOptionHooks(
    initialData: FilterListData[] = [],
    callBackFunction: () => void,
    getSearchList?: (search?: string) => void,
    initialSelectedValue?: number,
    initialIsLoading = true,
    initialIsError = false,
    initialErrorMessage?: string,
) {
    const [list, setList] = useState<FilterListData[]>(initialData);
    const [unfilteredList, setUnFilteredList] =
        useState<FilterListData[]>(initialData);
    const [searchText, setSearchText] = useState("");
    const [selectedValue, setSelectedValue] = useState<number | undefined>(
        initialSelectedValue,
    );
    const [isLoading, setIsLoading] = useState(initialIsLoading);
    const [error, setError] = useState(initialIsError);
    const [errorMessage, setErrorMessage] = useState(initialErrorMessage);

    useEffect(() => getSearchList && getSearchList(searchText), [searchText]);

    function updateSelectedValue(newSelectedValue: number) {
        if (selectedValue !== newSelectedValue)
            setSelectedValue(newSelectedValue);
    }

    function handleOnSearchChange(value?: string) {
        setSearchText(value || "");
    }

    function handleOnChange(value?: number) {
        if (value && value !== selectedValue) {
            updateSelectedValue(value);
        }
    }

    function refreshData() {
        callBackFunction();
    }

    function updateIsLoading(value: boolean) {
        setIsLoading(value);
    }

    function updateList(
        data: FilterListData[],
        error: boolean = false,
        message?: string,
        isLoading: boolean = false,
    ) {
        setList(data);
        setError(error);
        message && setErrorMessage(message);
        setIsLoading(isLoading);
    }

    function updateUnFilteredList(newList: FilterListData[]) {
        setUnFilteredList(newList);
    }

    return {
        list,
        isLoading,
        error,
        searchText,
        selectedValue,
        errorMessage,
        unfilteredList,
        updateList,
        updateIsLoading,
        updateSelectedValue,
        handleOnSearchChange,
        refreshData,
        handleOnChange,
        getSearchList,
        updateUnFilteredList,
    };
}

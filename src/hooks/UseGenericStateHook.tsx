import { useState } from "react";

export default function UseGenericStateHooks<Type>(
    initialData: Type,
    initialIsLoading = true,
    initialIsError = false,
    initialErrorMessage: string = "",
) {
    const [data, setData] = useState<Type>(initialData);
    const [isLoading, setIsLoading] = useState(initialIsLoading);
    const [error, setError] = useState(initialIsError);
    const [errorMessage, setErrorMessage] =
        useState<string>(initialErrorMessage);

    function updateState(
        data: Type,
        error = false,
        errorMessage?: string,
        isLoading = false,
    ) {
        setData(data);
        setError(error);
        setIsLoading(isLoading);
        errorMessage && setErrorMessage(errorMessage);
    }

    function updateIsLoading(isLoading: boolean) {
        setIsLoading(isLoading);
    }

    function refreshData(callBackFunction: () => void) {
        callBackFunction();
    }

    function updateError(error: boolean) {
        setError(error);
    }

    function updateErrorMessage(message: string) {
        setErrorMessage(message);
    }

    return {
        data,
        isLoading,
        error,
        errorMessage,
        updateState,
        updateIsLoading,
        refreshData,
        updateError,
        updateErrorMessage,
    };
}

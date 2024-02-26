import { useState } from "react";

export default function UseInputFieldHooks<Type>(initialData: Type) {
    const [data, setData] = useState(initialData);

    function handleOnChange(newData: Type) {
        setData(newData);
    }

    return {
        data,
        handleOnChange,
    };
}

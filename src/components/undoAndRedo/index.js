import { useState } from "react";

export const useHistory = (state) => {
    const [index, setIndex] = useState(0);
    const [elements, setElements] = useState([state]);

    const setState = (action, overwrite = false) => {
        const newState =
            typeof action === "function" ? action(elements[index]) : action;

        if (overwrite) {
            const elementsCopy = [...elements];
            elementsCopy[index] = newState;
            setElements(elementsCopy);
        } else {
            setElements((prevState) => [...prevState, newState]);
            setIndex((prevState) => prevState + 1);
        }
    };

    const undo = () => {
        index > 0 && setIndex((prevState) => prevState - 1);
    };

    const redo = () => {
        index < elements.length - 1 && setIndex((prevState) => prevState + 1);
    };

    return [elements[index], setState, undo, redo];
};
import { useEffect, useRef, useState } from "react";
import rough from "roughjs/bundled/rough.esm";
import { GrSelect } from "react-icons/gr";
import {
    FaRedo,
    FaUndo,
    FaSquare,
    FaCircle,
    FaPen,
    FaTrashAlt,
} from "react-icons/fa";
import { adjustElementCoordinates } from "./components/forms";
import {
    resizedCoordinater,
    getElementAtPosition,
} from "./components/coordenates";
import { useHistory } from "./components/undoAndRedo";
import { createElement } from "./components/createElement";
import "./style/app.css";
function App() {
    const initialState = [];
    const canvasRef = useRef(null);
    const constextRef = useRef(null);
    const [elements, setElements, undo, redo, clear] = useHistory(initialState);
    const [action, setAction] = useState("none");
    const [elementType, setElementType] = useState("");
    const [tool, setTool] = useState("");
    const [selectedElement, setSelectedElement] = useState(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const context = canvas.getContext("2d");
        context.lineCap = "round";
        context.strokeStyle = "black";
        context.lineWidth = "5px";
        constextRef.current = context;

        constextRef.current.clearRect(0, 0, canvas.width, canvas.height);
        const roughtCanvas = rough.canvas(canvas);
        elements.forEach(({ roughElement }) => roughtCanvas.draw(roughElement));
    }, [elements]);

    const updadeElement = (id, x0, y0, clientX, clientY, element) => {
        const changeElement = createElement(
            id,
            x0,
            y0,
            clientX,
            clientY,
            element
        );
        const elementsCopy = [...elements];
        elementsCopy[id] = changeElement;
        setElements(elementsCopy, true);
    };

    const startDrawing = (clientX, clientY) => {
        if (elementType === "select") {
            const element = getElementAtPosition(clientX, clientY, elements);
            if (element) {
                const offsetX = clientX - element.x0;
                const offsetY = clientY - element.y0;
                setSelectedElement({ ...element, offsetX, offsetY });
                if (element.position === "inside") {
                    setAction("moving");
                } else {
                    setAction("resizing");
                }
            }
        } else if (tool) {
            const id = elements.length;
            const element = createElement(
                id,
                clientX,
                clientY,
                clientX,
                clientY,
                tool
            );
            setElements((prevState) => [...prevState, element]);
            setSelectedElement(element);
            setAction("drawing");
        }
    };

    const onMouseDown = (event) => {
        const { clientX, clientY } = event;
        startDrawing(clientX, clientY);
    };

    const onTouchStart = (event) => {
        const { clientX, clientY } = event.touches[0];
        startDrawing(clientX, clientY);
    };

    const drawing = (clientX, clientY) => {
        if (action === "drawing") {
            const index = elements.length - 1;
            const { x0, y0 } = elements[index];
            updadeElement(index, x0, y0, clientX, clientY, tool);
        } else if (action === "moving") {
            const { id, x0, x1, y0, y1, offsetX, offsetY } = selectedElement;
            const { shape } = selectedElement.roughElement;
            const witdh = x1 - x0;
            const height = y1 - y0;
            const nexX0 = clientX - offsetX;
            const nexY0 = clientY - offsetY;
            updadeElement(
                id,
                nexX0,
                nexY0,
                nexX0 + witdh,
                nexY0 + height,
                shape
            );
        } else if (action === "resizing") {
            const { id, position, ...coordinates } = selectedElement;
            const { shape } = selectedElement.roughElement;
            const { x0, x1, y0, y1 } = resizedCoordinater(
                clientX,
                clientY,
                position,
                coordinates
            );
            updadeElement(id, x0, y0, x1, y1, shape);
        }
    };

    const onMouseMove = (event) => {
        const { clientX, clientY } = event;
        drawing(clientX, clientY);
    };

    const onTouchMove = (event) => {
        const { clientX, clientY } = event.touches[0];
        drawing(clientX, clientY);
    };

    const finishDrawing = () => {
        if (!selectedElement) return;
        const index = selectedElement.id;
        const { id } = elements[index];
        const { shape } = elements[index].roughElement;
        if (action === "drawing") {
            const { x0, y0, x1, y1 } = adjustElementCoordinates(
                elements[index]
            );
            updadeElement(id, x0, y0, x1, y1, shape);
        }
        setAction("none");
        setSelectedElement(null);
    };

    const onMouseUp = () => {
        finishDrawing();
    };

    const onTouchEnd = () => {
        finishDrawing();
    };

    const userChoice = (element) => {
        switch (element) {
            case "rectangle":
                setTool("rectangle");
                setElementType("");
                break;
            case "circle":
                setTool("circle");
                setElementType("");
                break;
            case "select":
                return setElementType("select");
            case "line":
                setTool("line");
                setElementType("");
                break;
            default:
                throw new Error(`Type not recognised: ${element}`);
        }
    };

    return (
        <>
            <div className="menu">
                <section
                    className="menu-button"
                    onClick={() => userChoice("line")}
                >
                    <FaPen />
                </section>
                <section
                    className="menu-button"
                    onClick={() => userChoice("circle")}
                >
                    <FaCircle />
                </section>
                <section
                    className="menu-button"
                    onClick={() => userChoice("rectangle")}
                >
                    <FaSquare />
                </section>
                <section className="menu-button" onClick={undo}>
                    <FaUndo />
                </section>
                <section className="menu-button" onClick={redo}>
                    <FaRedo />
                </section>
                <section
                    className="menu-button"
                    onClick={() => userChoice("select")}
                >
                    <GrSelect />
                </section>
                <section className="menu-button" onClick={clear}>
                    <FaTrashAlt />
                </section>
            </div>
            <canvas
                className="canvas"
                ref={canvasRef}
                onMouseDown={onMouseDown}
                onMouseMove={onMouseMove}
                onMouseUp={onMouseUp}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
            ></canvas>
        </>
    );
}

export default App;

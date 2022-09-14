import { useLayoutEffect, useRef, useState } from "react";
import rough from "roughjs/bundled/rough.esm";
import { GrSelect } from "react-icons/gr";
import { FaRedo, FaUndo, FaSquare, FaCircle, FaPen } from "react-icons/fa";

const generator = rough.generator();

function createElement(id, x0, y0, x1, y1, elementType) {
    let roughElement;
    switch (elementType) {
        // case "pen":
        //     roughElement = generator.line(x0, y0, x1, y1);
        //     return { x0, y0, x1, y1, roughElement };
        // case "circle":
        //     roughElement = generator.circle(x0, y0, x1, y1);
        //     return { x0, y0, x1, y1, roughElement };
        case "rectangle":
            roughElement = generator.rectangle(x0, y0, x1 - x0, y1 - y0);
            return { id, x0, y0, x1, y1, roughElement };
        default:
            roughElement = generator.line(x0, y0, x1, y1);
            return { id, x0, y0, x1, y1, roughElement };
    }
}

function App() {
    const canvasRef = useRef(null);
    const [elements, setElements] = useState([]);
    const [action, setAction] = useState("none");
    const [elementType, setElementType] = useState("");
    const [selectedElement, setSelectedElement] = useState(null);

    useLayoutEffect(() => {
        const canvas = canvasRef.current;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const context = canvas.getContext("2d");
        // context.lineCap = "round";
        // context.strokeStyle = "black";
        // context.lineWidth = "100px";

        context.clearRect(0, 0, canvas.width, canvas.height);
        const roughtCanvas = rough.canvas(canvas);

        elements.forEach(({ roughElement }) => roughtCanvas.draw(roughElement));
    }, [elements]);

    const distance = (variableOne, variableTwo) => {
        Math.sqrt(
            Math.pow(variableOne.clientX - variableTwo.clientX, 2) +
            Math.pow(variableOne.clientY - variableTwo.clientY, 2)
        );
    };

    const nearPoint = (x0, y0, x1, y1, shape) => {
        return Math.abs(x0 - x1) < 5 && Math.abs(y0 - y1) < 5 ? shape : null;
    };

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
        setElements(elementsCopy);
    };

    const adjustElementCoordinates = (element) => {
        const { shape } = element.roughElement;
        const { x0, x1, y0, y1 } = element;
        if (shape === "rectangle" || shape === "line") {
            const minX = Math.min(x0, x1);
            const maxX = Math.max(x0, x1);
            const minY = Math.min(y0, y1);
            const maxY = Math.max(y0, y1);
            return { x0: minX, y0: minY, x1: maxX, y1: maxY };
        } else {
            if (x0 < x1 || (x0 === x1 && y0 < y1)) {
                return { x0, y0, x1, y1 };
            } else {
                return { x0: x1, y0: y1, x1: x0, y1: y0 };
            }
        }
    };

    const isWithinElement = (clientX, clientY, element) => {
        const { shape } = element.roughElement;
        const { x0, x1, y0, y1 } = element;
        if (shape === "rectangle" || shape === "line") {
            const minX = Math.min(x0, x1);
            const maxX = Math.max(x0, x1);
            const minY = Math.min(y0, y1);
            const maxY = Math.max(y0, y1);
            return (
                clientX >= minX &&
                clientX <= maxX &&
                clientY >= minY &&
                clientY <= maxY
            );
        } else {
            const a = { clientX: x0, clientY: y0 };
            const b = { clientX: x1, clientY: y1 };
            const c = { clientX, clientY };
            const offset = distance(a, b) - (distance(a, c) - distance(b, c));
            return Math.abs(offset) < 1;
        }
    };

    const getElementAtPosition = (clientX, clientY, elements) => {
        return elements.find((element) =>
            isWithinElement(clientX, clientY, element)
        );
    };

    const startDrawing = (event) => {
        const { clientX, clientY } = event;
        if (elementType === "select") {
            const element = getElementAtPosition(clientX, clientY, elements);
            if (element) {
                const offsetX = clientX - element.x0;
                const offsetY = clientY - element.y0;
                setSelectedElement({ ...element, offsetX, offsetY });
                setAction("moving");
            }
        } else {
            setAction("drawing");
            const id = elements.length;
            const element = createElement(
                id,
                clientX,
                clientY,
                clientX,
                clientY,
                elementType
            );
            setElements((prevState) => [...prevState, element]);
        }
    };

    const drawing = (event) => {
        const { clientX, clientY } = event;
        if (action === "drawing") {
            const index = elements.length - 1;
            const { x0, y0 } = elements[index];
            updadeElement(index, x0, y0, clientX, clientY, elementType);
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
        }
    };

    const finishDrawing = () => {
        const index = elements.length - 1;
        const { id } = elements[index];
        const { shape } = elements[index].roughElement;
        console.log(index, id, shape);
        if (action === "drawing") {
            const { x0, y0, x1, y1 } = adjustElementCoordinates(
                elements[index]
            );
            updadeElement(id, x0, y0, x1, y1, shape);
        }
        setAction("none");
        setSelectedElement(null);
    };

    const userChoice = (element) => {
        switch (element) {
            case "rectangle":
                setElementType("rectangle");
                break;
            case "select":
                setElementType("select");
                break;
            default:
                setElementType("pen");
        }
    };

    return (
        <>
            <div
                style={{
                    display: "flex",
                    width: "45vw",
                    justifyContent: "space-evenly",
                }}
            >
                <section
                    style={{ cursor: "pointer" }}
                    onClick={() => userChoice("pen")}
                >
                    <FaPen />
                </section>
                <section
                    style={{ cursor: "pointer" }}
                    onClick={() => userChoice("circle")}
                >
                    <FaCircle />
                </section>
                <section
                    style={{ cursor: "pointer" }}
                    onClick={() => userChoice("rectangle")}
                >
                    <FaSquare />
                </section>
                <section
                    style={{ cursor: "pointer" }}
                    onClick={() => userChoice("undo")}
                >
                    <FaUndo />
                </section>
                <section
                    style={{ cursor: "pointer" }}
                    onClick={() => userChoice("redo")}
                >
                    <FaRedo />
                </section>
                <section
                    style={{ cursor: "pointer" }}
                    onClick={() => userChoice("select")}
                >
                    <GrSelect />
                </section>
            </div>
            <canvas
                style={{ background: "red" }}
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseMove={drawing}
                onMouseUp={finishDrawing}
            ></canvas>
        </>
    );
}

export default App;

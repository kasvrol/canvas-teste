import { useLayoutEffect, useRef, useState } from "react";
import rough from "roughjs/bundled/rough.esm";
import { GrSelect } from "react-icons/gr";
import { FaRedo, FaUndo, FaSquare, FaCircle, FaPen } from "react-icons/fa";

const generator = rough.generator();

function createElement(x0, y0, x1, y1, elementType) {
    switch (elementType) {
        case "pen":
            const roughElement = generator.line(x0, y0, x1, y1);
            return { x0, y0, x1, y1, roughElement };
        case "circle":
            roughElement = generator.circle(x0, y0, x1, y1);
            return { x0, y0, x1, y1, roughElement };
        case "square":
            roughElement = generator.rectangle(x0, y0, x1 - x0, y1 - y0);
            return { x0, y0, x1, y1, roughElement };
            break;
        default:
            return { x0, y0, x1, y1, roughElement };
    }
}

function App() {
    const canvasRef = useRef(null);
    const [elements, setElements] = useState([]);
    // const [isDrawing, setIsDrawing] = useState(false);
    const [action, setAction] = useState("none");
    const [elementType, setElementType] = useState(" ");
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

    const isWithinElement = (clientX, clientY, element) => {
        const { type, x0, x1, y0, y1 } = element;
        if (type === "square") {
            const minX = Math.min(x0, x1);
            const maxX = Math.max(x0, x1);
            const minY = Math.min(y0, y1);
            const maxY = Math.min(y0, y1);
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
            const offset = distance(a, b) - (distance(a, c) + distance(b, c));
            return Math.abs(offset) < 1;
        }
    };

    const getElementAtPosition = (clientX, clientY, elements) => {
        return elements.find((element) =>
            isWithinElement(clientX, clientY, element)
        );
    };

    const distance = (a, b) =>
        Math.sqrt(
            Math.pow(a.clientX - b.clientX, 2) +
            Math.pow(a.clientY - b.clientY, 2)
        );

    const startDrawing = (event) => {
        const { clientX, clientY } = event;
        if (elementType === "select") {
            const element = getElementAtPosition(clientX, clientY, elements);

            if (element) {
                setSelectedElement(element);
                setAction("moving");
            }
        } else {
            const element = createElement(clientX, clientY, clientX, clientY);
            setElements((prevState) => [...prevState, element]);
            setAction("drawing");
        }
    };

    const drawing = (event) => {
        if (action === "drawing") {
            const { clientX, clientY } = event;
            const index = elements.length - 1;
            const { x0, y0 } = elements[index];
            const updadeElement = createElement(
                x0,
                y0,
                clientX,
                clientY,
                elementType
            );

            const elementsCopy = [...elements];
            elementsCopy[index] = updadeElement;
            setElements(elementsCopy);
        } else if (action === "moving") {
            const { } = selectedElement;
        }


    };

    const finishDrawing = () => {
        setAction("none");
        setSelectedElement(null);
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
                    onChange={() => setElementType("pen")}
                >
                    <FaPen />
                </section>
                <section
                    style={{ cursor: "pointer" }}
                    onChange={() => setElementType("circle")}
                >
                    <FaCircle />
                </section>
                <section
                    style={{ cursor: "pointer" }}
                    onChange={() => setElementType("square")}
                >
                    <FaSquare />
                </section>
                <section
                    style={{ cursor: "pointer" }}
                    onChange={() => setElementType("undo")}
                >
                    <FaUndo />
                </section>
                <section
                    style={{ cursor: "pointer" }}
                    onChange={() => setElementType("redo")}
                >
                    <FaRedo />
                </section>
                <section
                    style={{ cursor: "pointer" }}
                    onChange={() => setElementType("select")}
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

import { useLayoutEffect, useRef, useState } from "react";
import rough from "roughjs/bundled/rough.esm";
import { GrSelect } from "react-icons/gr";
import { FaRedo, FaUndo, FaSquare, FaCircle, FaPen } from "react-icons/fa";

const generator = rough.generator();

function createElement(x0, y0, x1, y1, elementType) {
    let roughElement;
    switch (elementType) {
        // case "pen":
        //     roughElement = generator.line(x0, y0, x1, y1);
        //     return { x0, y0, x1, y1, roughElement };
        // case "circle":
        //     roughElement = generator.circle(x0, y0, x1, y1);
        //     return { x0, y0, x1, y1, roughElement };
        case "square":
            roughElement = generator.rectangle(x0, y0, x1 - x0, y1 - y0);
            return { x0, y0, x1, y1, roughElement };
        default:
            roughElement = generator.line(x0, y0, x1, y1);
            return { x0, y0, x1, y1, roughElement };
    }
}

function App() {
    const canvasRef = useRef(null);
    const [elements, setElements] = useState([]);
    const [action, setAction] = useState("none");
    const [elementType, setElementType] = useState(" ");

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
        const { shape } = element.roughElement;
        const { x0, x1, y0, y1 } = element;
        if (shape === "rectangle") {
            const minX = Math.min(x0, x1);
            const maxX = Math.max(x0, x1);
            const minY = Math.min(y0, y1);
            const maxY = Math.max(y0, y1);
            const position =
                clientX >= minX &&
                clientX <= maxX &&
                clientY >= minY &&
                clientY <= maxY;
            return position;
        } else {
            const minX = Math.min(clientX, clientY);
            const maxX = Math.max(clientX, clientY);
            const minY = Math.min(clientX, clientY);
            const maxY = Math.max(clientX, clientY);
            const position = { clientX, clientY };
            console.log("outro", minX);
            console.log("outro", maxX);
            console.log("outro", minY);
            console.log("outro", maxY);
            console.log("outro", position);
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
            console.log(elements);
            const element = getElementAtPosition(clientX, clientY, elements);
            setAction("moving");
            return element;
        } else {
            setAction("drawing");
            const element = createElement(
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
        }
    };

    const finishDrawing = () => {
        setAction("none");
    };

    const userChoice = (element) => {
        switch (element) {
            case "square":
                setElementType("square");
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
                    onClick={() => userChoice("square")}
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

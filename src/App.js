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
    const [isDrawing, setIsDrawing] = useState(false);
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

    const startDrawing = (event) => {
        setIsDrawing(true);
        const { clientX, clientY } = event;
        const element = createElement(clientX, clientY, clientX, clientY);
        setElements((prevState) => [...prevState, element]);
    };

    const drawing = (event) => {
        if (!isDrawing) return;

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
    };

    const finishDrawing = () => {
        setIsDrawing(false);
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

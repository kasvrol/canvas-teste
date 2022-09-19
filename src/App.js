import { useLayoutEffect, useRef, useState, useEffect } from "react";
import rough from "roughjs/bundled/rough.esm";
import { GrSelect } from "react-icons/gr";
import { FaRedo, FaUndo, FaSquare, FaCircle, FaPen } from "react-icons/fa";
import { adjustElementCoordinates } from "./components/forms";
import { cursorCoordenates, resizedCoordinater, getElementAtPosition } from "./components/coordenates";
import { useHistory } from "./components/undoAndRedo";
import { createElement } from "./components/createElement";

function App() {
    const canvasRef = useRef(null);
    const constextRef = useRef(null);
    const [elements, setElements, undo, redo] = useHistory([]);
    const [action, setAction] = useState("none");
    const [elementType, setElementType] = useState("");
    const [tool, setTool] = useState("");
    const [selectedElement, setSelectedElement] = useState(null);
    const [isDrawing, setIsDrawing] = useState(false);

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

    useEffect(() => {
        /*** CONFIGURAÇÃO DA TELA ***/
        const canvas = canvasRef.current;

        const context = canvas.getContext("2d");
        context.lineCap = "round";
        context.strokeStyle = "black";
        context.lineWidth = "5px";
        constextRef.current = context;
    }, []);

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

    const startDrawing = (event) => {
        const { clientX, clientY } = event
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
            setAction("drawing");
        }
        else if (elementType === 'pen') {
            constextRef.current.beginPath();
            constextRef.current.moveTo(clientX, clientY);
            setIsDrawing(true);
        }
    };

    const drawing = (event) => {
        const { clientX, clientY } = event
        if (elementType === "select") {
            const element = getElementAtPosition(clientX, clientY, elements);
            event.target.style.cursor = element
                ? cursorCoordenates(element.position)
                : "default";
        }

        if (action === "drawing" && tool != 'pen') {
            const index = elements.length - 1;
            const { x0, y0 } = elements[index];
            updadeElement(index, x0, y0, clientX, clientY, tool);
        } else if (isDrawing) {
            constextRef.current.lineTo(clientX, clientY);
            constextRef.current.stroke();
        } else if (!isDrawing) {
            return
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

    const finishDrawing = () => {
        const index = elements.length - 1;
        if (!elements[index]) return;
        const { id } = elements[index];
        const { shape } = elements[index].roughElement;
        if (action === "drawing") {
            const { x0, y0, x1, y1 } = adjustElementCoordinates(
                elements[index]
            );
            updadeElement(id, x0, y0, x1, y1, shape);
        }
        if (isDrawing) {
            constextRef.current.closePath();
            setIsDrawing(false);
        }
        setAction("none");
        setSelectedElement(null);
    };

    const userChoice = (element) => {
        switch (element) {
            case "rectangle":
                return setTool("rectangle") && setElementType("");
            case "ellipse":
                return setTool("ellipse") && setElementType("");
            case "select":
                return setElementType("select");
            case "line":
                return setTool("line") && setElementType("");
            case "pen":
                return setElementType("pen") && setTool("");
            default:
                throw new Error(`Type not recognised: ${element}`);
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
                    onClick={() => userChoice("ellipse")}
                >
                    <FaCircle />
                </section>
                <section
                    style={{ cursor: "pointer" }}
                    onClick={() => userChoice("rectangle")}
                >
                    <FaSquare />
                </section>
                <section style={{ cursor: "pointer" }} onClick={undo}>
                    <FaUndo />
                </section>
                <section style={{ cursor: "pointer" }} onClick={redo}>
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

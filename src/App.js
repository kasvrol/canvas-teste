import { useEffect, useRef, useState } from "react";
import rough from "roughjs/bundled/rough.esm";
import { GrSelect } from "react-icons/gr";
import { FaRedo, FaUndo, FaSquare, FaCircle, FaPen } from "react-icons/fa";
import { adjustElementCoordinates } from "./components/forms";
import {
    cursorCoordenates,
    resizedCoordinater,
    getElementAtPosition,
} from "./components/coordenates";
import { useHistory } from "./components/undoAndRedo";
import { createElement } from "./components/createElement";
import "./style/app.css";
function App() {
    const canvasRef = useRef(null);
    const constextRef = useRef(null);
    const [elements, setElements, undo, redo] = useHistory([]);
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

        context.clearRect(0, 0, canvas.width, canvas.height);
        const roughtCanvas = rough.canvas(canvas);
        elements.forEach(({ roughElement }) => roughtCanvas.draw(roughElement));
    }, [elements])

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
        const { clientX, clientY } = event;
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
    };

    const drawing = (event) => {
        const { clientX, clientY } = event;
        if (elementType === "select") {
            const element = getElementAtPosition(clientX, clientY, elements);
            event.target.style.cursor = element
                ? cursorCoordenates(element.position)
                : "default";
        }

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
        setAction("none");
        setSelectedElement(null);
    };

    const userChoice = (element) => {
        switch (element) {
            case "rectangle":
                setTool("rectangle");
                setElementType("");
                break;
            case "ellipse":
                setTool("ellipse");
                setElementType("");
                break;
            case "select":
                return setElementType("select");
            case "line":
                setTool("line")
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
                    onClick={() => userChoice("ellipse")}
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
            </div>
            <canvas
                className="canvas"
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseMove={drawing}
                onMouseUp={finishDrawing}
            ></canvas>
        </>
    );
}

export default App;

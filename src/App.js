import { useLayoutEffect, useRef, useState } from "react";
import rough from "roughjs/bundled/rough.esm";

const generator = rough.generator();

function createElement(x0, y0, x1, y1) {
    const roughElement = generator.line(x0, y0, x1, y1);
    return { x0, y0, x1, y1, roughElement };
}

function App() {
    const canvasRef = useRef(null);
    const [elements, setElements] = useState([]);
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
        const updadeElement = createElement(x0, y0, clientX, clientY);

        const elementsCopy = [...elements];
        elementsCopy[index] = updadeElement;
        setElements(elementsCopy);
    };

    const finishDrawing = () => {
        setIsDrawing(false);
    };

    return (
        <canvas
            style={{ background: "red" }}
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={drawing}
            onMouseUp={finishDrawing}
        ></canvas>
    );
}

export default App;

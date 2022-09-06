import { useLayoutEffect, useRef, useState } from "react";
import rough from "roughjs/bundled/rough.esm";

const generator = rough.generator();

function App() {
    const canvasRef = useRef(null);
    const [elements, setElements] = useState([]);
    const [isDrawing, setIsDrawing] = useState(false);

    useLayoutEffect(() => {
        const canvas = canvasRef.current;
        canvas.width = window.innerWidth * 2;
        canvas.height = window.innerHeight * 2;
        canvas.style.width = `${window.innerWidth}px`;
        canvas.style.height = `${window.innerHeight}px`;

        const context = canvas.getContext("2d");
        context.scale(2, 2);
        const roughtCanvas = rough.canvas(canvas);
    }, []);

    const startDrawing = (event) => {
        setIsDrawing(true);
    };

    const drawing = (event) => {
        if (!isDrawing) return;
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

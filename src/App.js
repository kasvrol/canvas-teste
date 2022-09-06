import { useEffect, useRef } from "react";

function App() {
    const canvasRef = useRef(null);

    useEffect(() => {

    }, [])

    const startDrawing = () => { };
    const drawing = () => { };
    const finishDrawing = () => { };

    return (

        <canvas
            onMouseDown={startDrawing}
            onMouseMove={drawing}
            onMouseUp={finishDrawing}
        >
            Canvas
        </canvas>

    );
}

export default App;

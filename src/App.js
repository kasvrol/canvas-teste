import { useLayoutEffect, useRef, useState } from "react";

function App() {
    const canvasRef = useRef(null);

    useLayoutEffect(() => {
        const canvas = canvasRef.current;
        canvas.width = window.innerWidth * 2;
        canvas.height = window.innerHeight * 2;
        canvas.style.width = `${window.innerWidth}px`;
        canvas.style.height = `${window.innerHeight}px`;

        const context = canvas.getContext("2d");
        context.scale(2, 2);
        context.lineCap = "round";
        context.strokeStyle = "black";
        context.lineWidth = "5px";
        constextRef.current = context;
    }, [])

    return <canvas style={{ background: 'red' }} ref={canvasRef}>

    </canvas>
}

export default App;

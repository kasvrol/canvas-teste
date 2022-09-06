function App() {

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

export const positionWithinElement = (clientX, clientY, element) => {
    const { shape } = element.roughElement;
    const { x0, x1, y0, y1 } = element;
    if (shape === "rectangle" || shape === "line" || shape === "ellipse") {
        const topLeft = nearPoint(clientX, clientY, x0, y0, "tl", shape);
        const topRight = nearPoint(clientX, clientY, x1, y0, "tr", shape);
        const bottomLeft = nearPoint(clientX, clientY, x0, y1, "bl", shape);
        const bottomRight = nearPoint(clientX, clientY, x1, y1, "br", shape);

        const inside =
            clientX >= x0 && clientX <= x1 && clientY >= y0 && clientY <= y1
                ? "inside"
                : null;
        return topLeft || topRight || bottomLeft || bottomRight || inside;
    } else {
        const a = { clientX: x0, clientY: y0 };
        const b = { clientX: x1, clientY: y1 };
        const c = { clientX, clientY };
        const offset = distance(a, b) - (distance(a, c) - distance(b, c));
        const start = nearPoint(clientX, clientY, x0, y0, "start");
        const end = nearPoint(clientX, clientY, x1, y1, "end");
        const inside = Math.abs(offset) < 1 ? "inside" : null;
        return start || end || inside;
    }
};
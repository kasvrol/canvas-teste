export const distance = (variableOne, variableTwo) => {
    Math.sqrt(
        Math.pow(variableOne.clientX - variableTwo.clientX, 2) +
        Math.pow(variableOne.clientY - variableTwo.clientY, 2)
    );
};

export const nearPoint = (x0, y0, x1, y1, quadrant, shape) => {
    let height
    let width
    if (shape === "rectangle") {
        height = 11
        width = 11
    } else if (shape === "ellipse") {
        height = 1
        width = 1
    }

    else {
        height = 7
        width = 2
    }
    return Math.abs(x0 - x1) < width && Math.abs(y0 - y1) < height ? quadrant : null;
};

export const adjustElementCoordinates = (element) => {
    const { shape } = element.roughElement;
    const { x0, x1, y0, y1 } = element;
    if (shape === "rectangle" || shape === "ellipse") {
        const minX = Math.min(x0, x1);
        const maxX = Math.max(x0, x1);
        const minY = Math.min(y0, y1);
        const maxY = Math.max(y0, y1);
        return { x0: minX, y0: minY, x1: maxX, y1: maxY };
    } else {
        if (x0 < x1 || (x0 === x1 && y0 < y1)) {
            return { x0, y0, x1, y1 };
        } else {
            return { x0: x1, y0: y1, x1: x0, y1: y0 };
        }
    }
};

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
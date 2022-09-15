import { nearPoint, distance } from "../forms";

const positionWithinElement = (clientX, clientY, element) => {
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

export const cursorCoordenates = (position) => {
    switch (position) {
        case "tl":
        case "br":
        case "start":
        case "end":
            return "nwse-resize";
        case "tr":
        case "bl":
            return "nesw-resize";
        default:
            return "move";
    }
};

export const resizedCoordinater = (clientX, clientY, position, coordinates) => {
    const { x0, x1, y0, y1 } = coordinates;
    switch (position) {
        case "tl" || "start":
            return { x0: clientX, y0: clientY, x1, y1 };
        case "tr":
            return { x0, y0: clientY, x1: clientX, y1 };
        case "br" || "end":
            return { x0, y0, x1: clientX, y1: clientY };
        case "bl":
            return { x0: clientX, y0, x1, y1: clientY };
        default:
            return null;
    }
};

export const getElementAtPosition = (clientX, clientY, elements) => {
    return elements
        .map((element) => ({
            ...element,
            position: positionWithinElement(clientX, clientY, element),
        }))
        .find((element) => element.position !== null);
};
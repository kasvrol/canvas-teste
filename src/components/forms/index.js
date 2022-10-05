export const distance = (variableOne, variableTwo) => {
    Math.sqrt(
        Math.pow(variableOne.clientX - variableTwo.clientX, 2) +
        Math.pow(variableOne.clientY - variableTwo.clientY, 2)
    );
};

function circleInsideAndBorder(clientX, clientY, x0, y0, x1, y1) {


    const circleRadius = {
        x: Math.abs((x1 - x0) / 2),
        y: Math.abs((y1 - y0) / 2),
    };

    const circleInside = { x: circleRadius.x - 7, y: circleRadius.y - 7 }

    const border = { x: circleRadius.x + 7, y: circleRadius.y + 7 }

    const o = { x: x0, y: y0 };

    const clientRadius = { x: Math.abs(clientX - o.x), y: Math.abs(clientY - o.y) };

    return {
        circleRadius, circleInside, border, clientRadius, o
    }
};

export const circleInsideOrOutside = (clientX, clientY, x0, y0, x1, y1) => {
    const circle = circleInsideAndBorder(clientX, clientY, x0, y0, x1, y1)

    if (circle.clientRadius.x <= circle.border.x && circle.clientRadius.y <= circle.border.y) {
        if (circle.clientRadius.x <= circle.circleInside.x && circle.clientRadius.y <= circle.circleInside.y) {
            return 'inside';
        } else {
            if (clientX <= circle.o.x && clientY <= circle.o.y) {
                return "tl"
            } else if (circle.o.x <= clientX && clientY <= circle.o.y) {
                return "tr"
            } else if (clientX <= circle.o.x && circle.o.y <= clientY) {
                return "bl"
            } else if (circle.o.x <= clientX && circle.o.y <= clientY) {
                return "br"
            }
        }
    } else {
        return null;
    }
};

export const nearPoint = (x0, y0, x1, y1, quadrant, shape) => {
    if (shape === "rectangle") {
        return Math.abs(x0 - x1) < 11 && Math.abs(y0 - y1) < 11
            ? quadrant
            : null;
    } else {
        return Math.abs(x0 - x1) < 2 && Math.abs(y0 - y1) < 7
            ? quadrant
            : null;
    }
};

export const adjustElementCoordinates = (element) => {
    const { shape } = element.roughElement;
    const { x0, x1, y0, y1 } = element;
    if (shape === "rectangle" || shape === "circle") {
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

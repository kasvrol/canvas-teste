export const distance = (variableOne, variableTwo) => {
    Math.sqrt(
        Math.pow(variableOne.clientX - variableTwo.clientX, 2) +
        Math.pow(variableOne.clientY - variableTwo.clientY, 2)
    );
};

const centerX = (x0, x1) => {
    switch ((x0, x1)) {
        case x0 < x1:
            return x0;
        case x0 > x1:
            return x1;
    }
};

const centerY = (y0, y1) => {
    switch ((y0, y1)) {
        case y0 < y1:
            return y0;
        case y0 > y1:
            return y1;
    }
};

function ellipseInsideAndBorder(clientX, clientY, x0, y0, x1, y1) {
    const ellipseRadius = {
        x: Math.abs((x1 - x0) / 2),
        y: Math.abs((y1 - y0) / 2),
    };

    const ellipseInside = { x: ellipseRadius.x - 10, y: ellipseRadius.y - 10 }
    const border = { x: ellipseRadius.x + 10, y: ellipseRadius.y + 10 }

    const o = { x: x0 + ellipseRadius.x, y: y0 + ellipseRadius.y };

    const clientRadius = { x: Math.abs(clientX - o.x), y: Math.abs(clientY - o.y) };

    return {
        ellipseRadius, ellipseInside, border, clientRadius, o
    }
};

export const ellipseInsideOrOutside = (clientX, clientY, x0, y0, x1, y1) => {
    const ellipse = ellipseInsideAndBorder(clientX, clientY, x0, y0, x1, y1)

    if (ellipse.clientRadius.x <= ellipse.border.x && ellipse.clientRadius.y <= ellipse.border.y) {
        if (ellipse.clientRadius.x <= ellipse.ellipseInside.x && ellipse.clientRadius.y <= ellipse.ellipseInside.y) {
            return 'inside';
        } else {
            if (clientX <= ellipse.o.x && clientY <= ellipse.o.y) {
                return "tl"
            } else if (ellipse.o.x <= clientX && clientY <= ellipse.o.y) {
                return "tr"
            } else if (clientX <= ellipse.o.x && ellipse.o.y <= clientY) {
                return "bl"
            } else if (ellipse.o.x <= clientX && ellipse.o.y <= clientY) {
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

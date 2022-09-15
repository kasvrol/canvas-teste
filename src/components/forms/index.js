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
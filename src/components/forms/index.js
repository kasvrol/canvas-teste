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

export const ellipseInside = (clientX, clientY, x0, y0, x1, y1) => {
    const a = Math.abs((x1 - x0) / 2); //distancia entre a origem e o vertice das abscissas 
    const b = Math.abs((y1 - y0) / 2);//distancia entre a origem e o vertice das ordenadas

    const abs = centerX(x0, x1) + a; //ponto da origem na abscissa
    const ord = centerY(y0, y1) + b;//ponto da origem na ordenada
    const o = { abs: abs, ord: ord };
    const x = Math.abs(clientX - o.abs);//distancia entre a origem e o clique do usuário
    const y = Math.abs(clientY - o.ord);//distancia entre a origem e o clique do usuário
    const xAndA = Math.pow(x, 2) / Math.pow(a, 2);
    const yAndB = Math.pow(y, 2) / Math.pow(b, 2);
    return Math.sqrt(xAndA + yAndB); //equação canônica ou reduzida da elipse
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

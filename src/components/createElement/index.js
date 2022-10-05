import rough from "roughjs/bundled/rough.esm";

const generator = rough.generator();

export const createElement = (id, x0, y0, x1, y1, tool) => {
    let roughElement;
    switch (tool) {
        case "line":
            roughElement = generator.line(x0, y0, x1, y1);
            return { id, x0, y0, x1, y1, roughElement };
        case "circle":
            roughElement = generator.circle(x0, y0, x0 - x1);
            return { id, x0, y0, x1, y1, roughElement };
        case "rectangle":
            roughElement = generator.rectangle(x0, y0, x1 - x0, y1 - y0);
            return { id, x0, y0, x1, y1, roughElement };
        default:
            throw new Error(`Type not recognised: ${tool}`);
    }
}


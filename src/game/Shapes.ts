class Shape {
    x: number;
    y: number;

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    draw(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {}

    setCoords(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

export class Circle extends Shape {
    radius: number;
    color: string;

    constructor(radius = 1, color = "red", x = 0, y = 0) {
        super(x, y);
        this.radius = radius;
        this.color = color;
    }

    draw(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D): void {
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        context.fillStyle = this.color;
        context.fill();
    }
}

export class Target extends Circle {
    constructor() {
        super(50, "blue");
    }

    setRandomCoords(canvas: HTMLCanvasElement) {
        this.x = Math.random() * (canvas.width - this.radius*2);
        this.y = Math.random() * (canvas.height - this.radius*2);
    }
}

export const detectCollision = (a: Shape, b: Shape) => {
    if (a instanceof Circle && b instanceof Circle) {
        return detectCircleCollision(a, b);
    }
    return false;
};

const detectCircleCollision = (a: Circle, b: Circle) => {
    if (
        Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2) <=
        Math.pow(a.radius + b.radius, 2)
    ) {
        return true;
    }
    return false;
};

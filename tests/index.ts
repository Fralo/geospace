import test from "node:test";
import assert from "node:assert/strict";

import { Target } from "../src/game/Shapes";

const xCoordIsOk = (width, x) => {
    return x >= 0 && x <= width;
};

const isLeft = (width: number, x: number) => {
    //NOTE this is specular
    return x >= width / 2;
};

const isRight = (width: number, x: number) => !isLeft(width, x);

test("test target random x coords left", (t) => {
    let tests = 1000;
    while (tests--) {
        let target = new Target();
        let x = target.getRandomXCoords(500, "LEFT");
        assert.ok(xCoordIsOk(500, x));
        assert.ok(isLeft(500, x));
    }
});

test("test target random x coords left", (t) => {
    let tests = 1000;
    while (tests--) {
        let target = new Target();
        let x = target.getRandomXCoords(500, "RIGHT");
        assert.ok(xCoordIsOk(500, x));
        assert.ok(isRight(500, x));
    }
});

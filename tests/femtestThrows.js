import { groupIt, assert } from "../utils/femtest/test.js";
const it = groupIt("femtestThrows")

it("throw blabla string now", function throwBlabla() {
    function throwsBlabla() {
        throw "blabla";
    }
    assert.throws(throwsBlabla, /^blabla$/);
});

it("throw blabla Error now", function throwBlabla() {
    function throwsBlabla() {
        throw new Error("blabla");
    }
    assert.throws(throwsBlabla, /^blabla$/);
});

import { groupIt, assert } from "../utils/femtest/test.js";
const itShould = groupIt("example : throwing errors")

itShould("throw blabla string now", function throwBlabla() {
    function throwsBlabla() {
        throw "blabla";
    }
    assert.throws(throwsBlabla, /^blabla$/);
});

itShould("throw blabla Error now", function throwBlabla() {
    function throwsBlabla() {
        throw new Error("blabla");
    }
    assert.throws(throwsBlabla, /^blabla$/);
});

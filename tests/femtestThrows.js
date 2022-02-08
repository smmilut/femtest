import { Test, assert } from "../utils/femtest/test.js";

Test.it("throw blabla now", function throwBlabla() {
    function throwsBlabla() {
        throw "blabla";
    }
    assert.throws(throwsBlabla, /^blabla$/);
});

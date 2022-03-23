import { groupIt, assert } from "../utils/femtest/test.js";
const itShould = groupIt("example : equals")

itShould("return 5 as sum(2, 3)", function testFive() {
    const val1 = 2, val2 = 3, expected = 5, result = val1 + val2;
    assert.strictEqual(result, expected);
});

itShould("assert deep equal objects", function deepEqual() {
    const obj1 = { a: { b: { c: { d: 123, x: 456, } } } };
    const obj2 = { a: { b: { c: { d: 123, x: 456, } } } };
    assert.objectsDeepEqual(obj1, obj2);
});

itShould("assert deep different objects", function deepDifferent() {
    const obj1 = { a: { b: { c: { d: 123, x: 456, } } } };
    const obj2 = { a: { b: { c: { d: 123, y: 456, } } } };
    function tryAssert() {
        assert.objectsDeepEqual(obj1, obj2);
    }
    assert.throws(tryAssert, /AssertError: Object \{"d":123,"y":456\} is missing the "x" property\./);
});
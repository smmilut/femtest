import { groupIt, assert } from "../utils/femtest/test.js";
const itShould = groupIt("JS things")

itShould("replace target when using Object.assign", function objectAssign() {
    const o1 = {
        a: "a1",
        b: "b1",
    };
    const o2 = {
        b: "b2",
        c: "c2",
    };
    const result = Object.assign(o1, o2);
    const expected = {
        a: "a1",
        b: "b2",
        c: "c2"
    };
    assert.objectsShallowStrictEqual(result, expected);
    assert.objectsShallowStrictEqual(o1, expected);
});

itShould("JSON stringify prototype properties", function JSONstringifyParent() {
    const myProto = {};
    myProto.myProtoPropStr = "a proto prop";
    myProto.myProtoPropNum = 456;
    myProto.myProtoFunc = function myProtoFunc() { return "returned by a proto function"; };
    const myObj = Object.create(myProto);
    myObj.ownPropStr = "own obj prop";
    myObj.ownPropNum = 123;
    myObj.ownFunc = function ownFunc() { return "returned by own func"; };
    const myJson = JSONstringifyEnumProps(myObj, function replacer(key, value) {
        if (typeof value === "string") {
            return `replacedString(${value})`;
        }
        return value;
    }, 2);
    assert.strictEqual(myJson,
        `{
  "ownPropStr": "replacedString(own obj prop)",
  "ownPropNum": 123,
  "myProtoPropStr": "replacedString(a proto prop)",
  "myProtoPropNum": 456
}`
    );

    /**
     * Get a flat object copy of all enumerable properties, including from the prototype chain
     * @param {*} obj 
     * @returns {Object} with all enumerable properties of `obj`, including from the prototype chain
     */
    function flatEnumProps(
        obj,
        replacer = function allowAll(key, value) {
            return { replacedKey: key, replacedValue: value, };
        }
    ) {
        const objCopy = {};
        for (const key in obj) {
            const value = obj[key];
            const replaced = replacer(key, value);
            if (replaced === undefined) {
                ///ignore
                continue;
            }
            const { replacedKey, replacedValue, } = replaced;
            objCopy[replacedKey] = replacedValue;
        }
        return objCopy;
    }
    /**
     * Stringify to JSON all enumerable properties of `obj`, including from the prototype chain
     * @param {*} obj 
     * @param {Function} replacer 
     * @param {Number} space 
     * @returns {String} JSON
     */
    function JSONstringifyEnumProps(obj, replacer, space) {
        const flatObj = flatEnumProps(obj);
        return JSON.stringify(flatObj, replacer, space);
    }
});
/**
 * Simplified assert
 *  inspired by Node's own `assert` as documented [here](https://nodejs.org/api/assert.html)
 */
export const assert = {
    strictEqual: function assert_strictEqual(value1, value2,
        {
            resolve = function resolveNothing() { return true; },
            reject = function rejectThrow(error) { throw error; },
        } = {}
    ) {
        if (value1 === value2) {
            return resolve();
        } else {
            return reject(new AssertError(`${value1} !== ${value2}`));
        }
    },
    almostEqual: function assert_almostEqual(value1, value2,
        {
            error = 0.001,
            resolve = function resolveNothing() { return true; },
            reject = function rejectThrow(error) { throw error; },
        } = {}
    ) {
        const distance = Math.abs(value1 - value2);
        if (distance <= error) {
            return resolve();
        } else {
            return reject(new AssertError(`${value1} !== ${value2}`));
        }
    },
    isTrue: function assert_isTrue(value,
        {
            resolve = function resolveNothing() { return true; },
            reject = function rejectThrow(error) { throw error; },
        } = {}
    ) {
        return assert.strictEqual(value, true, { resolve, reject });
    },
    throws: function assert_throws(fn, msgRegex,
        {
            resolve = function resolveNothing() { return true; },
            reject = function rejectThrow(error) { throw error; },
        } = {}
    ) {
        try {
            fn();
        } catch (error) {
            if (error.message !== undefined && msgRegex.exec(error.message)) {
                /// Error object with a .message matching the regex
                return resolve();
            } else if (msgRegex.exec(error)) {
                /// string matching the regex
                return resolve();
            }
            return reject(new AssertError(`Exception message "${error}" doesn't match "${msgRegex}".`));
        }
        return reject(new AssertError(`No exception thrown.`));
    },
    arraysEqual: function assert_arraysEqual(array1, array2,
        {
            resolve = function resolveNothing() { return true; },
            reject = function rejectThrow(error) { throw error; },
            equality = function strictEquality(a, b) { return a === b; },
        } = {}
    ) {
        if (!Array.isArray(array1)) {
            return reject(new AssertError(`"${array1}" !== "${array2}" because the first is not an Array.`));
        }
        if (!Array.isArray(array2)) {
            return reject(new AssertError(`[${array1}] !== "${array2}" because the second is not an Array.`));
        }
        if (array1.length !== array2.length) {
            return reject(new AssertError(`[${array1}] !== [${array2}] because they have different length.`));
        }
        if (!array1.every((val, index) => equality(val, array2[index]))) {
            return reject(new AssertError(`[${array1}] !== [${array2}] because they have different elements.`));
        }
        return resolve();
    },
    /**
     * Answer to : JSON.stringify(object1) === JSON.stringify(object2);
     * note : the "order" of properties actually matters !
     */
    objectsJsonEqual: function assert_objectsJsonEqual(object1, object2,
        {
            resolve = function resolveNothing() { return true; },
            reject = function rejectThrow(error) { throw error; },
        } = {}
    ) {
        const json1 = JSON.stringify(object1);
        const json2 = JSON.stringify(object2);
        if (json1 === json2) {
            return resolve();
        } else {
            return reject(AssertError(`Objects JSON strings are not equal for ${json1} and ${json2}.`));
        }
    },
    /**
     * Compare two objects :
     *  - does `object2` contain all the own properties of `object1` and are they all strictly equal ? 
     *  - does `object1` contain all the own properties of `object2` and are they all strictly equal ? 
     */
    objectsShallowStrictEqual: function assert_objectsShallowStrictEqual(object1, object2,
        {
            resolve = function resolveNothing() { return true; },
            reject = function rejectThrow(error) { throw error; },
        } = {}
    ) {
        assert._rightObjectHasAllLeftPropertiesStrictEqual(object1, object2, { resolve, reject });
        assert._rightObjectHasAllLeftPropertiesStrictEqual(object2, object1, { resolve, reject });
        return resolve();
    },
    /**
     * (internal) does `object2` contain all the own properties of `object1` and are they all strictly equal ?
     */
    _rightObjectHasAllLeftPropertiesStrictEqual: function assert_rightObjectHasAllLeftPropertiesStrictEqual(
        object1, object2,
        {
            resolve = function resolveNothing() { return true; },
            reject = function rejectThrow(error) { throw error; },
        } = {}
    ) {
        const json2 = JSON.stringify(object2);
        for (const key1 in object1) {
            if (Object.hasOwnProperty.call(object1, key1)) {
                const value1 = object1[key1];
                if (Object.hasOwnProperty.call(object2, key1)) {
                    const value2 = object2[key1];
                    if (value1 !== value2) {
                        return reject(new AssertError(`object1.${key1} === ${value1} !== ${value2} === object2.${key1}`));
                    }
                } else {
                    return reject(new AssertError(`Object ${json2} is missing the "${key1}" property.`));
                }
            }
        }
        return true;
    },
};

export class AssertError extends Error {
    constructor(...params) {
        super(...params)

        // Maintains proper stack trace for where our error was thrown (only available on V8)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, AssertError);
        }

        this.name = "AssertError";
    }
}
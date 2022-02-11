export const Test = (function build_Test() {
    const tests = [];
    return {
        /**
         * Write test with this.
         * 
         * @param {String} description test description in the present tense : "It should `description`"
         * @param {Function} test test function to run, throws on failure
         */
        it: function Test_it(description, test, groupName = "ungrouped") {
            tests.push({
                description,
                test,
                groupName,
            });
        },
        /**
         * run all tests and return results
         * @returns {object} {
                groups: Map([
                    [groupName1, { description, index, isPass, error, returned }],
                    [groupName2, result2],
                    ...]),
                summary: { totalLength, totalRun, countOk, countFail },
            }
         */
        runAll: function Test_runAll() {
            return tests.reduce(function runTest(results, t, i) {
                if (!results.groups.has(t.groupName)) {
                    results.groups.set(t.groupName, []);
                }
                const result = {
                    description: t.description,
                    index: i,
                };
                try {
                    result.returned = t.test();
                    result.isPass = true;
                    results.summary.countOk++;
                } catch (error) {
                    result.error = error;
                    result.isPass = false;
                    results.summary.countFail++;
                }
                results.summary.totalRun++;
                results.groups.get(t.groupName).push(result);
                return results;
            }, {
                groups: new Map(),
                summary: {
                    totalLength: tests.length,
                    totalRun: 0,
                    countOk: 0,
                    countFail: 0,
                },
            });
        },
    };
})();

/**
 * @param {string} groupName 
 * @returns function `it` preloaded with the groupName
 */
export function groupIt(groupName) {
    return function it(description, test) {
        return Test.it(description, test, groupName);
    };
}

/**
 * Simplified assert
 *  inspired by Node's own `assert` as documented [here](https://nodejs.org/api/assert.html)
 */
export const assert = {
    strictEqual: function assert_strictEqual(value1, value2) {
        if (value1 === value2) {
            return true;
        } else {
            throw new AssertError(`${value1} !== ${value2}`);
        }
    },
    throws: function assert_throws(fn, msgRegex) {
        try {
            fn();
        } catch (error) {
            if (error.message !== undefined && msgRegex.exec(error.message)) {
                /// Error object with a .message matching the regex
                return true;
            } else if (msgRegex.exec(error)) {
                /// string matching the regex
                return true;
            }
            throw new AssertError(`Exception message "${error}" doesn't match "${msgRegex}".`);
        }
        throw new AssertError(`No exception thrown.`);
    },
    arraysEqual: function assert_arraysEqual(array1, array2, equality = function strictEquality(a, b) { return a === b; }) {
        if (!Array.isArray(array1)) {
            throw new AssertError(`"${array1}" !== "${array2}" because the first is not an Array.`);
        }
        if (!Array.isArray(array2)) {
            throw new AssertError(`[${array1}] !== "${array2}" because the second is not an Array.`);
        }
        if (array1.length !== array2.length) {
            throw new AssertError(`[${array1}] !== [${array2}] because they have different length.`);
        }
        if (!array1.every((val, index) => equality(val, array2[index]))) {
            throw new AssertError(`[${array1}] !== [${array2}] because they have different elements.`);
        }
        return true;
    },
    /**
     * Answer to : JSON.stringify(object1) === JSON.stringify(object2);
     * note : the "order" of properties actually matters !
     */
    objectsJsonEqual: function assert_objectsJsonEqual(object1, object2) {
        const json1 = JSON.stringify(object1);
        const json2 = JSON.stringify(object2);
        if (json1 === json2) {
            return true;
        } else {
            throw new AssertError(`Objects JSON strings are not equal for ${json1} and ${json2}.`);
        }
    },
    /**
     * Compare two objects :
     *  - does `object2` contain all the own properties of `object1` and are they all strictly equal ? 
     *  - does `object1` contain all the own properties of `object2` and are they all strictly equal ? 
     */
    objectsShallowStrictEqual: function assert_objectsShallowStrictEqual(object1, object2) {
        assert._rightObjectHasAllLeftPropertiesStrictEqual(object1, object2);
        assert._rightObjectHasAllLeftPropertiesStrictEqual(object2, object1);
        return true;
    },
    /**
     * (internal) does `object2` contain all the own properties of `object1` and are they all strictly equal ?
     */
    _rightObjectHasAllLeftPropertiesStrictEqual: function assert_rightObjectHasAllLeftPropertiesStrictEqual(object1, object2) {
        const json2 = JSON.stringify(object2);
        for (const key1 in object1) {
            if (Object.hasOwnProperty.call(object1, key1)) {
                const value1 = object1[key1];
                if (Object.hasOwnProperty.call(object2, key1)) {
                    const value2 = object2[key1];
                    if (value1 !== value2) {
                        throw new AssertError(`object1.${key1} === ${value1} !== ${value2} === object1.${key1}`);
                    }
                } else {
                    throw new AssertError(`Object ${json2} is missing the "${key1}" property.`);
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
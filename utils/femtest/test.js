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
            if (msgRegex.exec(error)) {
                /// successfully matches the regex
                return true;
            }
            throw new AssertError(`Exception message "${error}" doesn't match "${msgRegex}".`);
        }
        throw new AssertError(`No exception thrown.`);
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
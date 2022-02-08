export const Test = (function build_Test() {
    let tests = [];
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
                    t.test();
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
            throw `${value1} !== ${value2}`
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
            throw `Exception message "${error}" doesn't match "${msgRegex}".`;
        }
        throw `No exception thrown.`;
    },
};
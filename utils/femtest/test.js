import { isAsync } from "./utils.js";

export * from "./assert.js";

export const Test = (function build_Test() {
    const tests = [];
    return {
        /**
         * Write test with this.
         * 
         * @param {String} description test description in the present tense : "It should `description`"
         * @param {Function} test test function to run, throws on failure
         */
        itShould: function Test_itShould(description, test, groupName = "ungrouped") {
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
        runAll: async function Test_runAll() {
            return tests.reduce(async function runTest(results, t, i) {
                results = await results;
                if (!results.groups.has(t.groupName)) {
                    results.groups.set(t.groupName, []);
                }
                const result = {
                    description: t.description,
                    index: i,
                };
                try {
                    if (isAsync(t.test)) {
                        console.log("Waiting for async test...")
                        let innerError;
                        result.returned = await t.test().catch(e => { innerError = e; });
                        if (innerError !== undefined) {
                            throw innerError;
                        }
                        console.log("... completed async test");
                    } else {
                        result.returned = t.test();
                    }
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
 * @returns function `itShould` preloaded with the groupName
 */
export function groupIt(groupName) {
    return function itShould(description, test) {
        return Test.itShould(description, test, groupName);
    };
}

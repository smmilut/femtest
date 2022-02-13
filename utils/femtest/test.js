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
                    [groupName0, { description, index, groupName, isPass, error, returned }],
                    [groupName1, result1],
                    ...]),
                promises: [ Promise(result0), Promise(result1), ...],
                summary: { totalLength, totalRun, countOk, countFail },
            }
         */
        runAll: async function Test_runAll() {
            const results = tests.reduce(function runTest(results, t, i) {
                if (!results.groups.has(t.groupName)) {
                    results.groups.set(t.groupName, []);
                }
                const promise = (new Promise(
                    function promiseRunTest(resolve, _reject) {
                        resolve(t.test());
                    }
                )).then(
                    function handleTestPass(value) {
                        results.summary.totalRun++;
                        results.summary.countOk++;
                        return {
                            returned: value,
                            isPass: true,
                        };
                    },
                    function handleTestFail(error) {
                        results.summary.totalRun++;
                        results.summary.countFail++;
                        return {
                            error: error,
                            isPass: false,
                        };
                    }
                ).then(
                    function finishResult(result) {
                        return Object.assign({
                            description: t.description,
                            index: i,
                            groupName: t.groupName,
                        }, result);
                    }
                );
                results.promises.push(promise);
                return results;
            }, {
                groups: new Map(),
                promises: [],
                summary: {
                    totalLength: tests.length,
                    totalRun: 0,
                    countOk: 0,
                    countFail: 0,
                },
            });
            /// Run all tests in parallel
            await Promise.all(results.promises);
            /// Aggregate groups
            results.promises.forEach(function pushToGroup(promise) {
                promise.then(
                    function pushResult(result) {
                        results.groups.get(result.groupName).push(result);
                    }
                )
                
            });
            return results;
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

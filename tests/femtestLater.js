import { groupIt, assert } from "../utils/femtest/test.js";
const itShould = groupIt("async / later");

itShould("eventually handle the correct value", async function later() {
    let value = "initial";
    setTimeout(function after1s() {
        value = "after 1s";
    }, 1000);
    /*
        If your tested functions use async behaviour like "setTimeout",
         then you should wrap the "assert" parts in Promises.
    */
    return new Promise(function runLater(resolve, reject) {
        value = "when starting Promise executor";
        /// Starting long operation for 2s
        setTimeout(function after2s() {
            /// Testing behaviour after 2s
            try {
                /*
                    All assert and all possible exceptions thrown from your tests
                     should be wrapped in try ... catch, then be rejected.
                */
                assert.strictEqual(value, "after 1s");
                resolve();
            } catch (e) {
                reject(e);
            }
        }, 2000);

        value = "when returning from Promise executor";
    });
});

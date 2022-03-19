import * as ExampleApp from "../www/exampleApp.js";
import { groupIt, assert } from "../utils/femtest/test.js";
const itShould = groupIt("JS things : Web Worker");

/**
 * ATTENTION : in Firefox, this creates an error that blocks all other tests
 */
itShould("get message from Web Worker", function wworker() {
    let value = "initial";
    const expected = `worker message : ${value}, ${ExampleApp.MAX_THINGS}, ${ExampleApp.add(2, 3)}`;
    return new Promise(function runWorker(resolve, reject) {
        /// https://stackoverflow.com/questions/44118600/web-workers-how-to-import-modules
        /// Doesn't work for Firefox as of 2022-03-15
        /// https://bugzilla.mozilla.org/show_bug.cgi?id=1247687
        const myWorker = new Worker(new URL("./jsDedicatedWorker.js", import.meta.url), { type: "module" });
        myWorker.addEventListener("message", function myWorker_onmessage(event) {
            assert.strictEqual(event.data, expected, { resolve, reject });
        });
        myWorker.postMessage(value);
    });
});

import { Test } from "./test.js";
import { gatherFiles } from "./files.js";

/**
 * Get list of test files, load tests, and run them 
 * @param {Function} log 
 */
async function gatherAndRun(log) {
    await gatherFiles("#filelist");
    Test.runAll(log);
}

/// GO
gatherAndRun(console.log);

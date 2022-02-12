import { gatherFiles } from "./files.js";
import { Test } from "./test.js";
import { view } from "./view.js";

/**
 * Get list of test files, load tests, run them, display results
 */
async function gatherRunView() {
    await gatherFiles("#filelist");
    const results = await Test.runAll();
    view(results, "#results");
}

/// GO
gatherRunView();

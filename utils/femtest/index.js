import { gatherFiles } from "./files.js";
import { isBrowser, isNode } from "./envUtils.js";
import { Test } from "./test.js";
import { view, viewFileList } from "./view.js";

/**
 * Get list of test files, load tests, run them, display results
 */
async function gatherRunView() {
    if (isBrowser()) {
        const filenames = await gatherFiles("./femtest.config.json");
        viewFileList(filenames, "#filelist", document);
        view(Test.getResultPromises(), "#results", document);
    } else if (isNode()) {
        throw new Error("Running in node is not implemented.");        
    } else {
        throw new Error("Only running in a web browser is currently implemented.");
    }
}

/// GO
gatherRunView();
